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
@Slf4j
@RequiredArgsConstructor
public class ComparisonController {

    private final ComparisonOrchestrator orchestrator;

    @GetMapping("/")
    @RequestMapping(value = "/", method = {RequestMethod.GET, RequestMethod.HEAD})
    public ResponseEntity<String> healthHome() {
        return ResponseEntity.ok("Price comparison running");
    }

    /**
     * POST /api/v1/compare
     * Body: { "userInput": "milk, coconut oil, charger", "pincode": "110001" }
     */
    @GetMapping("/api/v1/compare")
    public ResponseEntity<CompareResponse> compare(@RequestParam String userInput, @RequestParam String pincode) {
        log.info("GET /compare | input='{}' pincode={}",
            userInput,pincode);
            CompareRequest request = new CompareRequest();
            request.setUserInput(userInput);
            request.setPincode(pincode);
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
