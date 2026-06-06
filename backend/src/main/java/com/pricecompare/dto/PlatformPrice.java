package com.pricecompare.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class PlatformPrice {
    private String platform;           // zepto, blinkit, swiggy_instamart
    private String productId;
    private String productName;
    private String imageUrl;
    private String productUrl;
    private BigDecimal price;
    private BigDecimal mrp;
    private BigDecimal discountPct;
    private boolean available;
    private String stockLabel;
    private String deliveryTime;
    private String unit;
    private double score;              // computed by comparison agent
}
