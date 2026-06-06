package com.pricecompare.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "price_snapshots",
    indexes = {
        @Index(name = "idx_snap_product_pin", columnList = "product_id, pincode_id"),
        @Index(name = "idx_snap_scraped", columnList = "scraped_at DESC")
    })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "pincode_id", nullable = false)
    private Integer pincodeId;

    @Column(name = "source_id", nullable = false)
    private Integer sourceId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal mrp;

    @Column(name = "discount_pct", precision = 5, scale = 2)
    private BigDecimal discountPct;

    @Column(name = "discount_label")
    private String discountLabel;

    @Column(name = "is_available")
    private Boolean available;

    @Column(name = "stock_label")
    private String stockLabel;

    @Column(name = "delivery_time")
    private String deliveryTime;

    @Column(name = "scraped_at")
    private Instant scrapedAt;

    @Column(name = "scrape_run_id")
    private UUID scrapeRunId;
}
