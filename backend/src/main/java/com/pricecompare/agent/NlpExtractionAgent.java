package com.pricecompare.agent;

import com.pricecompare.dto.ExtractedItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Agent 1 — NLP Extraction
 *
 * Responsibilities:
 *  - Tokenize raw user input ("milk, charger, 2 coconut oils")
 *  - Normalize tokens (lowercase, remove quantities, singularize)
 *  - Resolve aliases (coke → cold drink, dahi → yogurt)
 *  - Return clean ExtractedItem list with confidence scores
 *
 * Deliberately kept rule-based (no heavy ML model) for:
 *  - Zero latency on startup
 *  - No external API cost
 *  - Sufficient accuracy for grocery/electronics domain
 */
@Component
@Slf4j
public class NlpExtractionAgent {

    // Common Indian grocery aliases → normalized name
    private static final Map<String, String> ALIAS_MAP = new LinkedHashMap<>() {{
        // Dairy
        put("dahi", "yogurt"); put("curd", "yogurt"); put("doi", "yogurt");
        put("dudh", "milk"); put("mawa", "khoya");
        // Oils
        put("tel", "oil"); put("nariyal tel", "coconut oil");
        put("sarson tel", "mustard oil"); put("vanaspati", "vegetable shortening");
        // Staples
        put("gehun", "wheat"); put("chawal", "rice"); put("dal", "lentils");
        put("chana", "chickpeas"); put("rajma", "kidney beans");
        // Drinks
        put("coke", "cold drink"); put("pepsi", "cold drink");
        put("chai", "tea"); put("kaafi", "coffee"); put("nimbu pani", "lemon drink");
        // Snacks
        put("namkeen", "snacks"); put("chakli", "snacks"); put("mathri", "snacks");
        // Electronics
        put("charger", "phone charger"); put("cable", "charging cable");
        put("earphone", "earphones"); put("earbud", "earbuds");
        put("headphone", "headphones"); put("powerbank", "power bank");
        // Personal care
        put("sabun", "soap"); put("toothbrush", "toothbrush");
    }};

    // Quantity patterns to strip: "2 litres", "500g", "1 kg", "dozen"
    private static final Pattern QUANTITY_PATTERN = Pattern.compile(
        "\\b\\d+(\\.\\d+)?\\s*(kg|g|gm|ml|l|ltr|litre|liter|pcs|pack|dozen|piece|bottle|can|box)s?\\b|\\b\\d+\\b",
        Pattern.CASE_INSENSITIVE
    );

    // Separators: commas, semicolons, "and", newlines, bullets
    private static final Pattern SEPARATOR = Pattern.compile(
        "[,;\\n•|]+|\\s+and\\s+|\\s+&\\s+",
        Pattern.CASE_INSENSITIVE
    );

    // Stop words to discard
    private static final Set<String> STOP_WORDS = Set.of(
        "some", "the", "a", "an", "of", "for", "my", "me", "i", "want",
        "need", "get", "buy", "please", "also", "few", "little", "more"
    );

    public List<ExtractedItem> extract(String rawInput) {
        log.info("NLP Agent: extracting from input: '{}'", rawInput);

        if (rawInput == null || rawInput.isBlank()) return List.of();

        String[] rawTokens = SEPARATOR.split(rawInput.trim());

        List<ExtractedItem> items = Arrays.stream(rawTokens)
            .map(String::trim)
            .filter(t -> !t.isBlank())
            .map(this::processToken)
            .filter(Objects::nonNull)
            .toList();

        // Deduplicate by normalized name
        Map<String, ExtractedItem> deduped = new LinkedHashMap<>();
        for (ExtractedItem item : items) {
            deduped.putIfAbsent(item.getNormalized(), item);
        }

        log.info("NLP Agent: extracted {} unique items", deduped.size());
        return new ArrayList<>(deduped.values());
    }

    private ExtractedItem processToken(String raw) {
        // Strip quantity indicators
        String cleaned = QUANTITY_PATTERN.matcher(raw).replaceAll("").trim();
        cleaned = cleaned.replaceAll("\\s+", " ").toLowerCase();

        if (cleaned.isBlank() || cleaned.length() < 2) return null;
        if (STOP_WORDS.contains(cleaned)) return null;

        // Resolve alias
        String normalized = resolveAlias(cleaned);

        // Compute confidence: higher if alias hit or clean word
        double confidence = raw.equals(cleaned) ? 0.75 : 0.90;
        if (ALIAS_MAP.containsKey(cleaned)) confidence = 0.95;

        return ExtractedItem.builder()
            .rawText(raw)
            .normalized(normalized)
            .confidence(confidence)
            .build();
    }

    private String resolveAlias(String term) {
        // Direct alias
        if (ALIAS_MAP.containsKey(term)) return ALIAS_MAP.get(term);

        // Partial match: "nariyal ka tel" → "coconut oil"
        for (Map.Entry<String, String> entry : ALIAS_MAP.entrySet()) {
            if (term.contains(entry.getKey())) return entry.getValue();
        }
        return term;
    }
}
