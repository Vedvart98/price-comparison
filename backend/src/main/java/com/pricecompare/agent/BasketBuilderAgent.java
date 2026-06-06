package com.pricecompare.agent;

import com.pricecompare.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Agent 5 — Basket Builder
 *
 * Builds exactly 3 baskets from the scored item comparisons:
 *
 *  A) CHEAPEST      — pick the cheapest available price per item, any platform
 *  B) BALANCED      — best composite score (price + delivery speed)
 *  C) FEWEST_PLATFORMS — minimize number of platforms needed (convenience)
 *
 * For each basket: calculates total estimate, lists all platforms used,
 * and counts unavailable items.
 */
@Component
@Slf4j
public class BasketBuilderAgent {

    @Value("${agents.basket.max-platforms:4}")
    private int maxPlatforms;

    public List<Basket> buildBaskets(List<ItemComparison> comparisons) {
        log.info("Basket Builder Agent: building 3 baskets from {} items", comparisons.size());

        List<Basket> baskets = new ArrayList<>();
        baskets.add(buildCheapestBasket(comparisons));
        baskets.add(buildBalancedBasket(comparisons));
        baskets.add(buildFewestPlatformsBasket(comparisons));

        return baskets;
    }

    // ── Basket A: CHEAPEST ─────────────────────────────────────────────────────

    private Basket buildCheapestBasket(List<ItemComparison> comparisons) {
        List<BasketItem> items = comparisons.stream()
            .map(comp -> {
                PlatformPrice best = comp.getPrices().stream()
                    .filter(PlatformPrice::isAvailable)
                    .min(Comparator.comparing(PlatformPrice::getPrice))
                    .orElse(null);
                return toBasketItem(comp.getItem().getNormalized(), best);
            })
            .collect(Collectors.toList());

        return Basket.builder()
            .strategy(Basket.Strategy.CHEAPEST)
            .title("Best Value")
            .description("Lowest price for each item, across all platforms")
            .items(items)
            .totalEstimate(sumTotal(items))
            .platforms(distinctPlatforms(items))
            .platformCount(countPlatforms(items))
            .unavailableCount(countUnavailable(items))
            .build();
    }

    // ── Basket B: BALANCED ─────────────────────────────────────────────────────

    private Basket buildBalancedBasket(List<ItemComparison> comparisons) {
        List<BasketItem> items = comparisons.stream()
            .map(comp -> {
                // Use top-scored (Agent 4 already sorted by composite score)
                PlatformPrice best = comp.getPrices().stream()
                    .filter(PlatformPrice::isAvailable)
                    .findFirst()
                    .orElse(null);
                return toBasketItem(comp.getItem().getNormalized(), best);
            })
            .collect(Collectors.toList());

        return Basket.builder()
            .strategy(Basket.Strategy.BALANCED)
            .title("Smart Pick")
            .description("Best balance of price and fast delivery")
            .items(items)
            .totalEstimate(sumTotal(items))
            .platforms(distinctPlatforms(items))
            .platformCount(countPlatforms(items))
            .unavailableCount(countUnavailable(items))
            .build();
    }

    // ── Basket C: FEWEST PLATFORMS ─────────────────────────────────────────────

    /**
     * Greedy algorithm: find the platform that covers the most items,
     * assign those items to it, repeat until all items are assigned.
     */
    private Basket buildFewestPlatformsBasket(List<ItemComparison> comparisons) {
        // Build map: platform → list of (itemName, price)
        Map<String, List<ItemComparison>> platformItems = new LinkedHashMap<>();

        for (ItemComparison comp : comparisons) {
            for (PlatformPrice pp : comp.getPrices()) {
                if (pp.isAvailable()) {
                    platformItems.computeIfAbsent(pp.getPlatform(), k -> new ArrayList<>()).add(comp);
                }
            }
        }

        Set<String> assignedItems = new HashSet<>();
        Map<String, BasketItem> result = new LinkedHashMap<>();

        // Greedy: pick platform with most unassigned items each round
        while (assignedItems.size() < comparisons.size() && !platformItems.isEmpty()) {
            // Find platform covering most remaining items
            String bestPlatform = platformItems.entrySet().stream()
                .max(Comparator.comparingLong(e ->
                    e.getValue().stream()
                        .filter(c -> !assignedItems.contains(c.getItem().getNormalized()))
                        .count()))
                .map(Map.Entry::getKey)
                .orElse(null);

            if (bestPlatform == null) break;

            // Assign items from this platform
            for (ItemComparison comp : platformItems.get(bestPlatform)) {
                String itemName = comp.getItem().getNormalized();
                if (!assignedItems.contains(itemName)) {
                    PlatformPrice pp = comp.getPrices().stream()
                        .filter(p -> p.getPlatform().equals(bestPlatform) && p.isAvailable())
                        .findFirst().orElse(null);
                    if (pp != null) {
                        result.put(itemName, toBasketItem(itemName, pp));
                        assignedItems.add(itemName);
                    }
                }
            }
            platformItems.remove(bestPlatform);
        }

        // Add remaining unavailable items
        comparisons.stream()
            .filter(c -> !assignedItems.contains(c.getItem().getNormalized()))
            .forEach(c -> result.put(c.getItem().getNormalized(),
                toBasketItem(c.getItem().getNormalized(), null)));

        List<BasketItem> items = new ArrayList<>(result.values());

        return Basket.builder()
            .strategy(Basket.Strategy.FEWEST_PLATFORMS)
            .title("One-Stop Shop")
            .description("Fewest platforms to shop from — maximum convenience")
            .items(items)
            .totalEstimate(sumTotal(items))
            .platforms(distinctPlatforms(items))
            .platformCount(countPlatforms(items))
            .unavailableCount(countUnavailable(items))
            .build();
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private BasketItem toBasketItem(String itemName, PlatformPrice pp) {
        if (pp == null) {
            return BasketItem.builder()
                .itemName(itemName)
                .available(false)
                .build();
        }
        return BasketItem.builder()
            .itemName(itemName)
            .platform(pp.getPlatform())
            .productName(pp.getProductName())
            .productUrl(pp.getProductUrl())
            .imageUrl(pp.getImageUrl())
            .unit(pp.getUnit())
            .price(pp.getPrice())
            .mrp(pp.getMrp())
            .discountPct(pp.getDiscountPct())
            .deliveryTime(pp.getDeliveryTime())
            .available(true)
            .build();
    }

    private BigDecimal sumTotal(List<BasketItem> items) {
        return items.stream()
            .filter(BasketItem::isAvailable)
            .map(BasketItem::getPrice)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private List<String> distinctPlatforms(List<BasketItem> items) {
        return items.stream()
            .filter(BasketItem::isAvailable)
            .map(BasketItem::getPlatform)
            .filter(Objects::nonNull)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }

    private int countPlatforms(List<BasketItem> items) {
        return (int) items.stream()
            .filter(BasketItem::isAvailable)
            .map(BasketItem::getPlatform)
            .filter(Objects::nonNull)
            .distinct().count();
    }

    private int countUnavailable(List<BasketItem> items) {
        return (int) items.stream().filter(i -> !i.isAvailable()).count();
    }
}
