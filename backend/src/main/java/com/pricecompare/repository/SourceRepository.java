package com.pricecompare.repository;

import com.pricecompare.model.Source;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SourceRepository extends JpaRepository<Source, Integer> {
    Optional<Source> findByName(String name);
    List<Source> findByActiveTrue();
}
