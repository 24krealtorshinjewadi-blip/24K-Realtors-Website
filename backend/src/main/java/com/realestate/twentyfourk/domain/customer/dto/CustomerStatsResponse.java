package com.realestate.twentyfourk.domain.customer.dto;

import java.math.BigDecimal;

public record CustomerStatsResponse(
        long totalCustomers,
        long hniInvestors,
        long nriInvestors,
        long individualBuyers,
        long kycVerified,
        long kycPending,
        BigDecimal totalPortfolioValue
) {}
