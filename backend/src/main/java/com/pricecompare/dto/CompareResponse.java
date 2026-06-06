package com.pricecompare.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CompareResponse {
    private List<ExtractedItem> extractedItems;
    private List<ItemComparison> comparisons;
    private List<Basket> baskets;          // always 3: CHEAPEST, BALANCED, FEWEST_PLATFORMS
    private List<String> notFoundItems;    // items with zero results
    private long processingTimeMs;
}
