package com.pricecompare.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "products",
    uniqueConstraints = @UniqueConstraint(columnNames = {"source_id", "source_product_id"}))
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "source_id", nullable = false)
    private Integer sourceId;

    @Column(name = "source_product_id")
    private String sourceProductId;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String category;
    private String subcategory;
    private String description;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    @Column(name = "product_url", length = 1024)
    private String productUrl;

    private String unit;

    @Column(name = "unit_size")
    private BigDecimal unitSize;

    @Column(name = "unit_type")
    private String unitType;

    @Column(columnDefinition = "text[]")
    private String[] tags;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
