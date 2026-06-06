package com.pricecompare.service;

import com.pricecompare.agent.*;
import com.pricecompare.dto.*;
import com.pricecompare.repository.SourceRepository;
import com.pricecompare.repository.PincodeRepository;
import com.pricecompare.model.Source;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * ComparisonOrchestrator — the main pipeline that chains all 5 agents.
 *
 * Pipeline:
 *   UserInput
 *     → [Agent 1] NlpExtractionAgent    → List<ExtractedItem>
 *     → [Agent 2] CategorizationAgent   → List<ExtractedItem> (with category)
 *     → [Agent 3] PriceQueryAgent       → List<ItemComparison>
 *     → [Agent 4] PriceComparisonAgent  → List<ItemComparison> (scored & sorted)
 *     → [Agent 5] BasketBuilderAgent    → List<Basket>
 *     → CompareResponse
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ComparisonOrchestrator {

    private final NlpExtractionAgent    nlpAgent;
    private final CategorizationAgent   categorizationAgent;
    private final PriceQueryAgent       priceQueryAgent;
    private final PriceComparisonAgent  comparisonAgent;
    private final BasketBuilderAgent    basketAgent;
    private final SourceRepository      sourceRepo;
    private final PincodeRepository     pincodeRepo;

    /**
     * Full pipeline execution.
     * The entire response is cached by (userInput + pincode) for 5 minutes.
     */
    @Cacheable(value = "comparisons", key = "#request.userInput.toLowerCase() + '_' + #request.pincode")
    public CompareResponse compare(CompareRequest request) {
        long start = System.currentTimeMillis();
        log.info("=== Pipeline START | input='{}' pincode={} ===",
            request.getUserInput(), request.getPincode());

        // ── Agent 1: Extract items ─────────────────────────────────────────
        List<ExtractedItem> extracted = nlpAgent.extract(request.getUserInput());
        if (extracted.isEmpty()) {
            return CompareResponse.builder()
                .extractedItems(List.of())
                .comparisons(List.of())
                .baskets(List.of())
                .notFoundItems(List.of())
                .processingTimeMs(System.currentTimeMillis() - start)
                .build();
        }

        // ── Agent 2: Categorize ────────────────────────────────────────────
        List<ExtractedItem> categorized = categorizationAgent.categorize(extracted);

        // ── Agent 3: Query DB prices ───────────────────────────────────────
        List<ItemComparison> comparisons = priceQueryAgent.queryPrices(
            categorized, request.getPincode());

        // ── Agent 4: Score & rank ──────────────────────────────────────────
        List<ItemComparison> scored = comparisonAgent.score(comparisons);

        // ── Agent 5: Build baskets ─────────────────────────────────────────
        List<Basket> baskets = basketAgent.buildBaskets(scored);

        // Collect items with no results
        List<String> notFound = scored.stream()
            .filter(c -> c.getPrices().isEmpty())
            .map(c -> c.getItem().getNormalized())
            .toList();

        long elapsed = System.currentTimeMillis() - start;
        log.info("=== Pipeline DONE | {}ms | {} items | {} not found ===",
            elapsed, categorized.size(), notFound.size());

        return CompareResponse.builder()
            .extractedItems(categorized)
            .comparisons(scored)
            .baskets(baskets)
            .notFoundItems(notFound)
            .processingTimeMs(elapsed)
            .build();
    }
}
