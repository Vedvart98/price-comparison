//package com.pricecompare.model;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//import java.math.BigDecimal;
//import java.time.Instant;
//
///**
// * Master catalog of items to scrape and compare prices for.
// *
// * This is the canonical list — every item the system knows about lives here.
// * The {@code normalized_name} is the key used for fuzzy matching against
// * user input. Once scraped, product listings are stored in the {@link Product} table.
// */
//@Entity
//@Table(name = "catalog_items",
//    uniqueConstraints = @UniqueConstraint(columnNames = {"normalized_name", "brand", "unit"}))
//@Data @Builder @NoArgsConstructor @AllArgsConstructor
//public class CatalogItem {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String name;
//
//    @Column(name = "normalized_name", nullable = false)
//    private String normalizedName;
//
//    private String brand;
//
//    private String barcode;
//
//    @Column(nullable = false)
//    private String category;
//
//    private String subcategory;
//
//    @Column(columnDefinition = "text[]")
//    private String[] tags;
//
//    private String unit;
//
//    @Column(name = "unit_size")
//    private BigDecimal unitSize;
//
//    @Column(name = "unit_type", length = 10)
//    private String unitType;
//
//    @Column(columnDefinition = "text")
//    private String description;
//
//    @Column(name = "image_url")
//    private String imageUrl;
//
//    @Column(nullable = false)
//    private String source;
//
//    @Column(name = "source_id")
//    private String sourceId;
//
//    @Column(name = "source_url")
//    private String sourceUrl;
//
//    @Column(name = "is_active")
//    @Builder.Default
//    private Boolean isActive = true;
//
//    @Column(name = "scrape_priority")
//    @Builder.Default
//    private Integer scrapePriority = 5;
//
//    @Column(name = "last_seen")
//    private Instant lastSeen;
//
//    @CreationTimestamp
//    @Column(name = "created_at", updatable = false)
//    private Instant createdAt;
//
//    @UpdateTimestamp
//    @Column(name = "updated_at")
//    private Instant updatedAt;
//}
