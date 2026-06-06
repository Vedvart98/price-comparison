package com.pricecompare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CompareRequest {
    @NotBlank(message = "Input text is required")
    private String userInput;          // raw text from user e.g. "milk, charger, coconut oil"

    @NotNull
    private String pincode;            // delivery pincode for availability

    private boolean includeOutOfStock = false;
}
