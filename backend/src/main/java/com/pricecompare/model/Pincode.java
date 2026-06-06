package com.pricecompare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pincodes")
@Data @Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pincode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String pincode;

    private String city;
    private String state;

    @Column(name = "is_active")
    private Boolean active = true;
}
