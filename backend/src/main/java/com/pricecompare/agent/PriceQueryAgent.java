package com.pricecompare.agent;

import com.pricecompare.dto.ExtractedItem;
import com.pricecompare.dto.ItemComparison;
import com.pricecompare.dto.PlatformPrice;
import com.pricecompare.model.Pincode;
import com.pricecompare.model.Product;
import com.pricecompare.model.PriceSnapshot;
import com.pricecompare.model.Source;
import com.pricecompare.repository.PincodeRepository;
import com.pricecompare.repository.PriceSnapshotRepository;
import com.pricecompare.repository.ProductRepository;
import com.pricecompare.repository.SourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Agent 3 — DB Price Query
 *
 * For each extracted item:
 *  1. Fuzzy-search products table for matching products
 *  2. Fetch the latest price snapshot per (product, source, pincode)
 *  3. Build an ItemComparison with all platform prices
 *
 * Caching: results keyed on (normalized item name + pincode) with 5-min TTL.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class PriceQueryAgent {

    private final ProductRepository productRepo;
    private final PriceSnapshotRepository snapshotRepo;
    private final SourceRepository sourceRepo;
    private final PincodeRepository pincodeRepo;

    private static final int MAX_PRODUCTS_PER_ITEM = 5;

    /**
     * Build ItemComparisons for all extracted items.
     * Runs product searches in parallel using virtual threads.
     */
    public List<ItemComparison> queryPrices(List<ExtractedItem> items, String pincodeStr) {
        log.info("Price Query Agent: querying {} items for pincode {}", items.size(), pincodeStr);

        Pincode pincode = pincodeRepo.findByPincode(pincodeStr)
            .orElseGet(() -> {
                log.warn("Pincode {} not found in DB — using first available", pincodeStr);
                return pincodeRepo.findAll().stream().findFirst()
                    .orElseThrow(() -> new IllegalStateException("No pincodes in DB"));
            });

        Map<Integer, Source> sourceMap = sourceRepo.findByActiveTrue().stream()
            .collect(Collectors.toMap(Source::getId, s -> s));

        return items.parallelStream()
            .map(item -> queryItem(item, pincode, sourceMap))
            .collect(Collectors.toList());
    }

    @Cacheable(value = "itemPrices", key = "#item.normalized + '_' + #pincode.pincode")
    public ItemComparison queryItem(ExtractedItem item, Pincode pincode,
                                    Map<Integer, Source> sourceMap) {
        log.debug("Querying: '{}' in category '{}'", item.getNormalized(), item.getCategory());

        // Find matching products (fuzzy search)
        List<Product> products = productRepo.searchByName(item.getNormalized(), MAX_PRODUCTS_PER_ITEM);
        if (products.isEmpty() && item.getCategory() != null) {
            products = productRepo.searchByCategoryAndName(
                item.getCategory(), item.getNormalized(), MAX_PRODUCTS_PER_ITEM);
        }

        if (products.isEmpty()) {
            log.warn("No products found for '{}'", item.getNormalized());
            return ItemComparison.builder()
                .item(item)
                .prices(List.of())
                .availableAnywhere(false)
                .build();
        }

        // Get latest price for each product across all sources
        UUID[] productIds = products.stream().map(Product::getId).toArray(UUID[]::new);
        List<PriceSnapshot> snapshots = snapshotRepo.findLatestByProductsAndPincode(
            productIds, pincode.getId());

        // Build platform prices: join product + snapshot + source
        Map<UUID, Product> productMap = products.stream()
            .collect(Collectors.toMap(Product::getId, p -> p));

        List<PlatformPrice> platformPrices = snapshots.stream()
            .filter(s -> s.getAvailable() == null || s.getAvailable())
            .map(snap -> {
                Product product = productMap.get(snap.getProductId());
                Source source   = sourceMap.get(snap.getSourceId());
                if (product == null || source == null) return null;
                return PlatformPrice.builder()
                    .platform(source.getName())
                    .productId(product.getId().toString())
                    .productName(product.getName())
                    .imageUrl(product.getImageUrl())
                    .productUrl(product.getProductUrl())
                    .price(snap.getPrice())
                    .mrp(snap.getMrp())
                    .discountPct(snap.getDiscountPct())
                    .available(Boolean.TRUE.equals(snap.getAvailable()))
                    .stockLabel(snap.getStockLabel())
                    .deliveryTime(snap.getDeliveryTime())
                    .unit(product.getUnit())
                    .build();
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());

        // Include out-of-stock entries too (for reference)
        List<PlatformPrice> all = snapshots.stream()
            .filter(s -> Boolean.FALSE.equals(s.getAvailable()))
            .map(snap -> {
                Product product = productMap.get(snap.getProductId());
                Source source   = sourceMap.get(snap.getSourceId());
                if (product == null || source == null) return null;
                return PlatformPrice.builder()
                    .platform(source.getName())
                    .productId(product.getId().toString())
                    .productName(product.getName())
                    .imageUrl(product.getImageUrl())
                    .productUrl(product.getProductUrl())
                    .price(snap.getPrice())
                    .mrp(snap.getMrp())
                    .discountPct(snap.getDiscountPct())
                    .available(false)
                    .stockLabel("Out of Stock")
                    .deliveryTime(snap.getDeliveryTime())
                    .unit(product.getUnit())
                    .build();
            })
            .filter(Objects::nonNull)
            .toList();

        platformPrices.addAll(all);

        PlatformPrice best = platformPrices.stream()
            .filter(PlatformPrice::isAvailable)
            .min(Comparator.comparing(p -> p.getPrice()))
            .orElse(null);

        return ItemComparison.builder()
            .item(item)
            .prices(platformPrices)
            .bestPrice(best)
            .availableAnywhere(!platformPrices.stream().filter(PlatformPrice::isAvailable).findAny().isEmpty())
            .build();
    }
}
