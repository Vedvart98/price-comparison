package com.pricecompare.agent;

import com.pricecompare.dto.ItemComparison;
import com.pricecompare.dto.PlatformPrice;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

/**
 * Agent 4 — Price Comparison & Scoring
 *
 * Scores each platform's offer for an item using a weighted formula:
 *   score = priceScore * 0.60 + availabilityScore * 0.25 + deliveryScore * 0.15
 *
 * priceScore     = 1 - (price / maxPrice)  → cheapest gets 1.0
 * availabilityScore = 1.0 if in stock, 0.0 if not
 * deliveryScore  = parsed from delivery time string (10min → 1.0, 2hr → 0.4)
 *
 * Sorts each ItemComparison's prices list by descending score.
 */
@Component
@Slf4j
public class PriceComparisonAgent {

    @Value("${agents.comparison.scoring.price-weight:0.60}")
    private double priceWeight;

    @Value("${agents.comparison.scoring.availability-weight:0.25}")
    private double availabilityWeight;

    @Value("${agents.comparison.scoring.delivery-weight:0.15}")
    private double deliveryWeight;

    public List<ItemComparison> score(List<ItemComparison> comparisons) {
        log.info("Comparison Agent: scoring {} item comparisons", comparisons.size());
        comparisons.forEach(this::scoreComparison);
        return comparisons;
    }

    private void scoreComparison(ItemComparison comparison) {
        List<PlatformPrice> prices = comparison.getPrices();
        if (prices.isEmpty()) return;

        // Find max price among available items (for normalization)
        BigDecimal maxPrice = prices.stream()
            .filter(PlatformPrice::isAvailable)
            .map(PlatformPrice::getPrice)
            .max(Comparator.naturalOrder())
            .orElse(BigDecimal.ONE);

        if (maxPrice.compareTo(BigDecimal.ZERO) == 0) maxPrice = BigDecimal.ONE;

        final BigDecimal finalMax = maxPrice;
        prices.forEach(pp -> {
            double priceScore = pp.isAvailable()
                ? 1.0 - pp.getPrice().divide(finalMax, 4, java.math.RoundingMode.HALF_UP).doubleValue()
                : 0.0;
            double availScore  = pp.isAvailable() ? 1.0 : 0.0;
            double delivScore  = parseDeliveryScore(pp.getDeliveryTime());

            double score = (priceScore * priceWeight)
                         + (availScore  * availabilityWeight)
                         + (delivScore  * deliveryWeight);

            pp.setScore(Math.round(score * 1000.0) / 1000.0);
        });

        // Sort: best score first
        prices.sort(Comparator.comparingDouble(PlatformPrice::getScore).reversed());

        // Re-assign bestPrice after scoring
        comparison.setBestPrice(
            prices.stream().filter(PlatformPrice::isAvailable).findFirst().orElse(null)
        );
    }

    /**
     * Parse delivery time string → 0.0–1.0 score.
     * "10 mins" → 1.0, "30 mins" → 0.8, "2 hours" → 0.4, unknown → 0.5
     */
    private double parseDeliveryScore(String deliveryTime) {
        if (deliveryTime == null || deliveryTime.isBlank()) return 0.5;
        String d = deliveryTime.toLowerCase().trim();

        // Extract leading number
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("(\\d+)").matcher(d);
        if (!m.find()) return 0.5;
        int value = Integer.parseInt(m.group(1));

        if (d.contains("min")) {
            // 10 min → 1.0, 60 min → 0.5
            return Math.max(0.1, 1.0 - (value - 10) / 100.0);
        } else if (d.contains("hour") || d.contains("hr")) {
            // 1 hr → 0.5, 4 hr → 0.2
            return Math.max(0.1, 0.6 - (value * 0.1));
        } else if (d.contains("day")) {
            return Math.max(0.05, 0.3 - (value * 0.05));
        }
        return 0.5;
    }
}
