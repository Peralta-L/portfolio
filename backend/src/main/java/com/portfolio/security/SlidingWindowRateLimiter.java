package com.portfolio.security;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory sliding-window rate limiter keyed by client (e.g. IP address).
 *
 * <p>Good enough for a single instance. When the API scales out, swap this for a
 * shared store such as Redis behind the same {@link #tryAcquire} contract.
 */
public class SlidingWindowRateLimiter {

    /** Above this many tracked clients, idle entries are swept to bound memory. */
    private static final int SWEEP_THRESHOLD = 10_000;

    private final int maxRequests;
    private final Duration window;
    private final Clock clock;
    private final Map<String, Deque<Instant>> hits = new ConcurrentHashMap<>();

    public SlidingWindowRateLimiter(int maxRequests, Duration window, Clock clock) {
        this.maxRequests = maxRequests;
        this.window = window;
        this.clock = clock;
    }

    /** Records a request for {@code key}; returns {@code false} if it exceeds the limit. */
    public boolean tryAcquire(String key) {
        Instant now = clock.instant();
        Instant cutoff = now.minus(window);
        if (hits.size() > SWEEP_THRESHOLD) {
            sweep(cutoff);
        }

        Deque<Instant> timestamps = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && !timestamps.peekFirst().isAfter(cutoff)) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= maxRequests) {
                return false;
            }
            timestamps.addLast(now);
            return true;
        }
    }

    /** Seconds until {@code key} may send another request (at least 1). */
    public long retryAfterSeconds(String key) {
        Deque<Instant> timestamps = hits.get(key);
        if (timestamps == null) {
            return 1;
        }
        synchronized (timestamps) {
            Instant oldest = timestamps.peekFirst();
            if (oldest == null) {
                return 1;
            }
            long seconds = Duration.between(clock.instant(), oldest.plus(window)).toSeconds();
            return Math.max(1, seconds);
        }
    }

    private void sweep(Instant cutoff) {
        hits.entrySet().removeIf(entry -> {
            Deque<Instant> timestamps = entry.getValue();
            synchronized (timestamps) {
                Instant newest = timestamps.peekLast();
                return newest == null || !newest.isAfter(cutoff);
            }
        });
    }
}
