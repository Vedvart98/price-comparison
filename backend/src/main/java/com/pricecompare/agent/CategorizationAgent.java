package com.pricecompare.agent;

import com.pricecompare.dto.ExtractedItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Agent 2 — Categorization
 *
 * Maps each extracted item to a category + subcategory.
 * This drives which scraper sources we query for each item.
 *
 * Categories: grocery, electronics, produce, fmcg, personal_care, dairy, beverages
 */
@Component
@Slf4j
public class CategorizationAgent {

    record CategoryRule(String category, String subcategory) {}

    // keyword → (category, subcategory)
    private static final Map<String, CategoryRule> RULES = new LinkedHashMap<>() {{
        // Dairy
        put("milk",       new CategoryRule("grocery", "dairy"));
        put("yogurt",     new CategoryRule("grocery", "dairy"));
        put("curd",       new CategoryRule("grocery", "dairy"));
        put("paneer",     new CategoryRule("grocery", "dairy"));
        put("butter",     new CategoryRule("grocery", "dairy"));
        put("ghee",       new CategoryRule("grocery", "dairy"));
        put("cheese",     new CategoryRule("grocery", "dairy"));
        put("cream",      new CategoryRule("grocery", "dairy"));
        put("khoya",      new CategoryRule("grocery", "dairy"));

        // Staples / Grains
        put("rice",       new CategoryRule("grocery", "staples"));
        put("atta",       new CategoryRule("grocery", "staples"));
        put("flour",      new CategoryRule("grocery", "staples"));
        put("wheat",      new CategoryRule("grocery", "staples"));
        put("lentils",    new CategoryRule("grocery", "staples"));
        put("dal",        new CategoryRule("grocery", "staples"));
        put("chickpeas",  new CategoryRule("grocery", "staples"));
        put("sugar",      new CategoryRule("grocery", "staples"));
        put("salt",       new CategoryRule("grocery", "staples"));
        put("bread",      new CategoryRule("grocery", "bakery"));
        put("eggs",       new CategoryRule("grocery", "eggs_and_meat"));

        // Oils
        put("oil",              new CategoryRule("grocery", "oils"));
        put("coconut oil",      new CategoryRule("grocery", "oils"));
        put("mustard oil",      new CategoryRule("grocery", "oils"));
        put("olive oil",        new CategoryRule("grocery", "oils"));
        put("sunflower oil",    new CategoryRule("grocery", "oils"));

        // Snacks
        put("chips",      new CategoryRule("grocery", "snacks"));
        put("biscuits",   new CategoryRule("grocery", "snacks"));
        put("cookies",    new CategoryRule("grocery", "snacks"));
        put("snacks",     new CategoryRule("grocery", "snacks"));
        put("namkeen",    new CategoryRule("grocery", "snacks"));
        put("popcorn",    new CategoryRule("grocery", "snacks"));
        put("noodles",    new CategoryRule("grocery", "snacks"));

        // Beverages
        put("coffee",       new CategoryRule("grocery", "beverages"));
        put("tea",          new CategoryRule("grocery", "beverages"));
        put("juice",        new CategoryRule("grocery", "beverages"));
        put("cold drink",   new CategoryRule("grocery", "beverages"));
        put("water",        new CategoryRule("grocery", "beverages"));
        put("energy drink", new CategoryRule("grocery", "beverages"));

        // Fruits & Vegetables
        put("apple",      new CategoryRule("produce", "fruits"));
        put("banana",     new CategoryRule("produce", "fruits"));
        put("mango",      new CategoryRule("produce", "fruits"));
        put("orange",     new CategoryRule("produce", "fruits"));
        put("grapes",     new CategoryRule("produce", "fruits"));
        put("tomato",     new CategoryRule("produce", "vegetables"));
        put("onion",      new CategoryRule("produce", "vegetables"));
        put("potato",     new CategoryRule("produce", "vegetables"));
        put("spinach",    new CategoryRule("produce", "vegetables"));
        put("carrot",     new CategoryRule("produce", "vegetables"));

        // Personal care
        put("shampoo",      new CategoryRule("personal_care", "hair"));
        put("conditioner",  new CategoryRule("personal_care", "hair"));
        put("soap",         new CategoryRule("personal_care", "bathing"));
        put("body wash",    new CategoryRule("personal_care", "bathing"));
        put("toothpaste",   new CategoryRule("personal_care", "oral_care"));
        put("toothbrush",   new CategoryRule("personal_care", "oral_care"));
        put("face wash",    new CategoryRule("personal_care", "skincare"));
        put("moisturizer",  new CategoryRule("personal_care", "skincare"));
        put("sunscreen",    new CategoryRule("personal_care", "skincare"));
        put("deodorant",    new CategoryRule("personal_care", "grooming"));
        put("razor",        new CategoryRule("personal_care", "grooming"));
        put("sanitary",     new CategoryRule("personal_care", "feminine_hygiene"));

        // Electronics / Accessories
        put("phone charger",   new CategoryRule("electronics", "mobile_accessories"));
        put("charging cable",  new CategoryRule("electronics", "mobile_accessories"));
        put("power bank",      new CategoryRule("electronics", "mobile_accessories"));
        put("earphones",       new CategoryRule("electronics", "audio"));
        put("earbuds",         new CategoryRule("electronics", "audio"));
        put("headphones",      new CategoryRule("electronics", "audio"));
        put("usb cable",       new CategoryRule("electronics", "mobile_accessories"));
        put("screen protector",new CategoryRule("electronics", "mobile_accessories"));
        put("phone case",      new CategoryRule("electronics", "mobile_accessories"));
        put("battery",         new CategoryRule("electronics", "batteries"));

        // Household / Cleaning
        put("detergent",   new CategoryRule("household", "cleaning"));
        put("dishwash",    new CategoryRule("household", "cleaning"));
        put("floor cleaner",new CategoryRule("household", "cleaning"));
        put("tissue",      new CategoryRule("household", "paper_products"));
        put("napkin",      new CategoryRule("household", "paper_products"));
        put("garbage bag", new CategoryRule("household", "cleaning"));
    }};

    public List<ExtractedItem> categorize(List<ExtractedItem> items) {
        log.info("Categorization Agent: processing {} items", items.size());
        items.forEach(this::assignCategory);
        return items;
    }

    private void assignCategory(ExtractedItem item) {
        String term = item.getNormalized().toLowerCase();

        // Direct match
        CategoryRule rule = RULES.get(term);
        if (rule != null) {
            item.setCategory(rule.category());
            item.setSubcategory(rule.subcategory());
            return;
        }

        // Partial / contains match (handles multi-word queries)
        for (Map.Entry<String, CategoryRule> entry : RULES.entrySet()) {
            if (term.contains(entry.getKey()) || entry.getKey().contains(term)) {
                item.setCategory(entry.getValue().category());
                item.setSubcategory(entry.getValue().subcategory());
                return;
            }
        }

        // Fallback heuristics
        if (term.contains("oil") || term.contains("sauce") || term.contains("spice")) {
            item.setCategory("grocery"); item.setSubcategory("condiments");
        } else if (term.contains("cable") || term.contains("adapter") || term.contains("charger")) {
            item.setCategory("electronics"); item.setSubcategory("mobile_accessories");
        } else if (term.contains("wash") || term.contains("clean") || term.contains("sanitizer")) {
            item.setCategory("personal_care"); item.setSubcategory("hygiene");
        } else {
            item.setCategory("grocery"); item.setSubcategory("general");
        }

        log.debug("Categorized '{}' → {}/{} (fallback)", term, item.getCategory(), item.getSubcategory());
    }
}
