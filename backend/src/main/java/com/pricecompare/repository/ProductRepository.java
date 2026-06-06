package com.pricecompare.repository;

import com.pricecompare.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Trigram-based fuzzy search (uses pg_trgm index on name)
    @Query(value = """
        SELECT * FROM products
        WHERE similarity(name, :term) > 0.25
           OR name ILIKE '%' || :term || '%'
        ORDER BY similarity(name, :term) DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Product> searchByName(@Param("term") String term, @Param("limit") int limit);

    // Search by category
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) = LOWER(:category)")
    List<Product> findByCategory(@Param("category") String category);

    // Search within category by name
    @Query(value = """
        SELECT * FROM products
        WHERE LOWER(category) = LOWER(:category)
          AND similarity(name, :term) > 0.2
        ORDER BY similarity(name, :term) DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Product> searchByCategoryAndName(
        @Param("category") String category,
        @Param("term") String term,
        @Param("limit") int limit
    );
}
