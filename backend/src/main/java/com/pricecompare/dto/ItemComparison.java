package com.pricecompare.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ItemComparison {
    private ExtractedItem item;
    private List<PlatformPrice> prices;  // sorted best → worst by score
    private PlatformPrice bestPrice;     // cheapest available
    private boolean availableAnywhere;
}
