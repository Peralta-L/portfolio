package com.portfolio.dto;

import java.time.Instant;

public record ContactResponse(String status, Instant receivedAt) {

    public static ContactResponse received() {
        return new ContactResponse("received", Instant.now());
    }
}
