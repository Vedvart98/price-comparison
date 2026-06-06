package com.pricecompare.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class BasketItem {
    private String itemName;
    private String platform;
    private String productName;
    private String productUrl;
    private String imageUrl;
    private String unit;
    private BigDecimal price;
    private BigDecimal mrp;
    private BigDecimal discountPct;
    private String deliveryTime;
    private boolean available;
}
