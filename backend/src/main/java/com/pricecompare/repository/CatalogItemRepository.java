//package com.pricecompare.repository;
//
//import com.pricecompare.model.CatalogItem;
//import org.springframework.cache.annotation.Cacheable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface CatalogItemRepository extends JpaRepository<CatalogItem, Long> {
//
//    @Cacheable("catalogItems")
//    Optional<CatalogItem> findByNormalizedName(String normalizedName);
//
//    boolean existsByNormalizedName(String normalizedName);
//
//    @Cacheable("catalogItems")
//    Optional<CatalogItem> findByName(String name);
//
//    @Cacheable("catalogItems")
//    List<CatalogItem> findByCategory(String category);
//
//    @Query(value = """
//        SELECT * FROM catalog_items
//        WHERE similarity(normalized_name, :term) > 0.2
//           OR normalized_name ILIKE '%' || :term || '%'
//           OR name ILIKE '%' || :term || '%'
//        ORDER BY similarity(normalized_name, :term) DESC
//        LIMIT :limit
//        """, nativeQuery = true)
//    List<CatalogItem> searchByName(@Param("term") String term, @Param("limit") int limit);
//
//    @Query(value = """
//        SELECT * FROM catalog_items
//        WHERE category = :category
//          AND similarity(normalized_name, :term) > 0.2
//        ORDER BY similarity(normalized_name, :term) DESC
//        LIMIT :limit
//        """, nativeQuery = true)
//    List<CatalogItem> searchByCategoryAndName(
//        @Param("category") String category,
//        @Param("term") String term,
//        @Param("limit") int limit
//    );
//}
