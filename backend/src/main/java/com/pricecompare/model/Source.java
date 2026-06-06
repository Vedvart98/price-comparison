package com.pricecompare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sources")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Source {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "base_url", nullable = false)
    private String baseUrl;

    @Column(name = "is_active")
    private Boolean active = true;
}
