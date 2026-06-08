package com.pricecompare.controller;

import com.pricecompare.dto.CompareRequest;
import com.pricecompare.dto.CompareResponse;
import com.pricecompare.service.ComparisonOrchestrator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/compare")
// @CrossOrigin(origins = {"http://localhost:4200", "${allowed.origins:}"})
@Slf4j
@RequiredArgsConstructor
public class ComparisonController {

    private final ComparisonOrchestrator orchestrator;

     @GetMapping("/")
    @RequestMapping(value = "/", method = {RequestMethod.GET, RequestMethod.HEAD})
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Price comparison running");
    }

    /**
     * POST /api/v1/compare
     * Body: { "userInput": "milk, coconut oil, charger", "pincode": "110001" }
     */
    @PostMapping
    public ResponseEntity<CompareResponse> compare(@Valid @RequestBody CompareRequest request) {
        log.info("POST /compare | input='{}' pincode={}",
            request.getUserInput(), request.getPincode());
        CompareResponse response = orchestrator.compare(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/compare/health — quick sanity check
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Price Comparison API is running");
    }
}
