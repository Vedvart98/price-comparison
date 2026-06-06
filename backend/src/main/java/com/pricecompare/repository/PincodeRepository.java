package com.pricecompare.repository;

import com.pricecompare.model.Pincode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PincodeRepository extends JpaRepository<Pincode, Integer> {
    Optional<Pincode> findByPincode(String pincode);
}
