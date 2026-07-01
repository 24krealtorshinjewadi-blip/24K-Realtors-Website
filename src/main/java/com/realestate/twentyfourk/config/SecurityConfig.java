package com.realestate.twentyfourk.config;

import com.realestate.twentyfourk.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
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
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            // Permit frame options for local H2 database console visibility
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
            .authorizeHttpRequests(auth -> auth
                // Allow H2 database console lookups in local dev profile
                .requestMatchers("/h2-console/**").permitAll()
                // Authentication API
                .requestMatchers("/api/v1/auth/**").permitAll()
                
                // Public Property search lookups
                .requestMatchers(HttpMethod.GET, "/api/v1/properties/**").permitAll()
                // Administrative Property updates require SUPER_ADMIN/ADMIN/SALES_MANAGER
                .requestMatchers(HttpMethod.POST, "/api/v1/properties/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/v1/properties/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/properties/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER")

                // Public Customer lead capture hook
                .requestMatchers(HttpMethod.POST, "/api/v1/leads").permitAll()
                // Administrative Leads access requires sales roles
                .requestMatchers("/api/v1/leads/**").hasAnyRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER", "RELATIONSHIP_MANAGER", "TELECALLER")

                // Agents management requires admin-level access
                .requestMatchers("/api/v1/agents/**").hasAnyRole("SUPER_ADMIN", "ADMIN")

                // Audit logs lookup requires admin-level access
                .requestMatchers("/api/v1/audit-logs/**").hasAnyRole("SUPER_ADMIN", "ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*")); // Permissive CORS for Phase 3 dev sandbox
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
