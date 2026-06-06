package com.pricecompare.repository;

import com.pricecompare.model.PriceSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface PriceSnapshotRepository extends JpaRepository<PriceSnapshot, Long> {

    /**
     * Latest price snapshot per product per source, within a pincode.
     * Uses DISTINCT ON (PostgreSQL extension) for efficiency.
     */
    @Query(value = """
        SELECT DISTINCT ON (ps.product_id, ps.source_id)
            ps.*
        FROM price_snapshots ps
        WHERE ps.product_id = ANY(:productIds)
          AND ps.pincode_id = :pincodeId
        ORDER BY ps.product_id, ps.source_id, ps.scraped_at DESC
        """, nativeQuery = true)
    List<PriceSnapshot> findLatestByProductsAndPincode(
        @Param("productIds") UUID[] productIds,
        @Param("pincodeId") Integer pincodeId
    );

    /**
     * Price history for a single product (for trend charts).
     */
    @Query(value = """
        SELECT * FROM price_snapshots
        WHERE product_id = :productId
          AND pincode_id = :pincodeId
          AND source_id = :sourceId
        ORDER BY scraped_at DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<PriceSnapshot> findHistory(
        @Param("productId") UUID productId,
        @Param("pincodeId") Integer pincodeId,
        @Param("sourceId") Integer sourceId,
        @Param("limit") int limit
    );
}
