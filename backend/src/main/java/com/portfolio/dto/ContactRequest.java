package com.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Contact form payload.
 *
 * @param website honeypot field: hidden from people, so only bots fill it in
 */
public record ContactRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be a valid address")
        @Size(max = 254, message = "Email must be at most 254 characters")
        String email,

        @NotBlank(message = "Subject is required")
        @Size(max = 150, message = "Subject must be at most 150 characters")
        String subject,

        @NotBlank(message = "Message is required")
        @Size(min = 10, max = 5000, message = "Message must be between 10 and 5000 characters")
        String message,

        String website) {

    public boolean isLikelySpam() {
        return website != null && !website.isBlank();
    }
}
