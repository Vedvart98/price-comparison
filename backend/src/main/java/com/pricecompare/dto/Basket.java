package com.pricecompare.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class Basket {
    public enum Strategy { CHEAPEST, BALANCED, FEWEST_PLATFORMS }

    private Strategy strategy;
    private String title;
    private String description;
    private List<BasketItem> items;
    private BigDecimal totalEstimate;
    private int platformCount;
    private List<String> platforms;
    private int unavailableCount;      // items not found anywhere
}
