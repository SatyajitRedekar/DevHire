package com.devhire.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${devhire.internal.api.key:devhire-super-secret-key-1234}")
    private String internalApiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();

        // 1. Allow preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Handle System Ingestion Route with Internal API Key
        if ("/api/jobs/external".equals(path) && "POST".equalsIgnoreCase(method)) {
            String apiKeyHeader = httpRequest.getHeader("Authorization");
            if (apiKeyHeader == null) {
                apiKeyHeader = httpRequest.getHeader("X-API-KEY");
            }
            
            String tokenValue = null;
            if (apiKeyHeader != null) {
                if (apiKeyHeader.startsWith("Bearer ")) {
                    tokenValue = apiKeyHeader.substring(7).trim();
                } else {
                    tokenValue = apiKeyHeader.trim();
                }
            }
            
            if (tokenValue != null && tokenValue.equals(internalApiKey)) {
                httpRequest.setAttribute("userId", 0L);
                httpRequest.setAttribute("role", "SYSTEM");
                httpRequest.setAttribute("email", "system@devhire.com");

                // Set Spring Security Context
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        "system@devhire.com", null, List.of(new SimpleGrantedAuthority("ROLE_SYSTEM")));
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                filterChain.doFilter(request, response);
                return;
            } else {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.getWriter().write("Invalid or missing internal API key");
                return;
            }
        }

        // 3. Authenticate protected routes via JWT
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = jwtUtil.extractClaims(token);
                if (!jwtUtil.isTokenExpired(claims)) {
                    Long userId = jwtUtil.getUserId(claims);
                    String role = jwtUtil.getRole(claims);
                    String email = jwtUtil.getEmail(claims);

                    // Attach claims to request attributes for backward compatibility with existing controllers
                    httpRequest.setAttribute("userId", userId);
                    httpRequest.setAttribute("role", role);
                    httpRequest.setAttribute("email", email);

                    // Set Spring Security Context
                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                email, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception ex) {
                // Do not throw or block request here; Spring Security's SecurityFilterChain will deny unauthorized access.
            }
        }

        filterChain.doFilter(request, response);
    }
}
