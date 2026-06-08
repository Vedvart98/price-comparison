package com.pricecompare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExtractedItem {
    private String rawText;            // original word from user
    private String normalized;         // lowercased, singularized
    private String category;           // grocery, electronics, produce, fmcg, personal_care
    private String subcategory;        // dairy, snacks, mobile_accessories, etc.
    private double confidence;         // 0.0 – 1.0
}
