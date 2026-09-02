package com.realestate.twentyfourk.config;

import com.realestate.twentyfourk.security.JwtAuthenticationFilter;
import com.realestate.twentyfourk.security.RateLimitingFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.header.HeaderWriterFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final RateLimitingFilter rateLimitingFilter;
    private final AuthenticationProvider authenticationProvider;

    @Value("${cors.allowed-origins:http://localhost:5173,http://localhost:5174,http://localhost:3000,http://127.0.0.1:*,http://192.168.*:*,https://real-estate-digital-marketing.vercel.app,https://real-estate-digital-marketing-*.vercel.app}")
    private List<String> allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            // Secure security headers with sameOrigin frames and CSP policies
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
                .contentSecurityPolicy(csp -> csp.policyDirectives("frame-ancestors 'self'"))
            )
            .authorizeHttpRequests(auth -> auth
                // Allow H2 database console lookups in local dev profile
                .requestMatchers("/h2-console/**").permitAll()
                // Expose ONLY Actuator health endpoint for container orchestration publicly
                .requestMatchers("/actuator/health").permitAll()
                // Authentication API
                .requestMatchers("/api/v1/auth/**").permitAll()
                
                // Public Property search lookups
                .requestMatchers(HttpMethod.GET, "/api/v1/properties/**").permitAll()

                // ---------------------------------------------------------------
                // PUBLIC INTELLIGENCE API — /api/public/**
                // No authentication required. Serves the public-facing website.
                // ---------------------------------------------------------------
                .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()

                // Administrative Property updates require SUPER_ADMIN/ADMIN/CRM_ADMIN/SALES_MANAGER
                .requestMatchers(HttpMethod.POST, "/api/v1/properties/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/v1/properties/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/properties/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER")

                // Public Blogs access
                .requestMatchers(HttpMethod.GET, "/api/v1/blogs/**").permitAll()
                // Administrative Blogs access
                .requestMatchers(HttpMethod.POST, "/api/v1/blogs/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/blogs/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/blogs/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN")

                // Public Societies, Builders, and Localities search lookups
                .requestMatchers(HttpMethod.GET, "/api/v1/societies/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/builders/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/localities/**").permitAll()

                // Administrative access to Societies, Builders, and Localities
                .requestMatchers(HttpMethod.POST, "/api/v1/societies/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/v1/societies/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/societies/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/v1/builders/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/v1/localities/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER")

                // Media Upload & Download access
                .requestMatchers(HttpMethod.GET, "/api/v1/media/files/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/media/upload").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER")

                // Public Customer lead capture hook
                .requestMatchers(HttpMethod.POST, "/api/v1/leads").permitAll()
                // Administrative Leads access requires sales roles
                .requestMatchers("/api/v1/leads/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN", "SALES_MANAGER", "RELATIONSHIP_MANAGER", "TELECALLER")

                // Agents management requires admin-level access
                .requestMatchers("/api/v1/agents/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN")

                // Audit logs lookup requires admin-level access
                .requestMatchers("/api/v1/audit-logs/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "CRM_ADMIN")

                // User management (role changes, user list) — SUPER_ADMIN only
                .requestMatchers("/api/v1/users/**").hasRole("SUPER_ADMIN")

                // Work From Home requests require authentication
                .requestMatchers("/api/v1/wfh/**").authenticated()

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(rateLimitingFilter, HeaderWriterFilter.class)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(allowedOrigins); // Production-hardened CORS lockdown via application config/env vars
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
