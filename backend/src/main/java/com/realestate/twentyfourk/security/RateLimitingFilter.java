package com.realestate.twentyfourk.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Production-grade Rate Limiter for public APIs and Authentication endpoints.
 * Protects endpoints from DDoS/brute-force attacks.
 */
@Component
public class RateLimitingFilter implements Filter {

    private final Map<String, UserRateLimit> limiters = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS = 60; // 60 requests per minute
    private static final long TIME_WINDOW_MS = TimeUnit.MINUTES.toMillis(1);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        
        // Rate limit public authentication, lead capture, and public API calls
        if (path.startsWith("/api/v1/auth/") || path.startsWith("/api/v1/leads")) {
            String ip = httpRequest.getRemoteAddr();
            
            // Handle reverse proxy setups (Vercel, Railway, Cloudflare)
            String xForwardedFor = httpRequest.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isBlank()) {
                ip = xForwardedFor.split(",")[0].trim();
            }

            long now = System.currentTimeMillis();
            UserRateLimit limit = limiters.computeIfAbsent(ip, k -> new UserRateLimit(now));

            synchronized (limit) {
                if (now - limit.windowStartTime > TIME_WINDOW_MS) {
                    limit.windowStartTime = now;
                    limit.requestCount = 0;
                }

                if (limit.requestCount >= MAX_REQUESTS) {
                    httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                    httpResponse.setContentType("application/json");
                    httpResponse.getWriter().write("{\"error\": \"Too many requests. Please try again in a minute.\"}");
                    return;
                }

                limit.requestCount++;
            }
        }

        chain.doFilter(request, response);
    }

    private static class UserRateLimit {
        long windowStartTime;
        int requestCount;

        UserRateLimit(long startTime) {
            this.windowStartTime = startTime;
            this.requestCount = 0;
        }
    }
}
