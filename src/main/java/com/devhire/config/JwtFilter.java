package com.devhire.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class JwtFilter implements Filter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();

        // 1. Allow preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        // 2. Allow public routes
        boolean isPublicJobRoute = "/api/jobs".equals(path) && "GET".equalsIgnoreCase(method);
        boolean isPublicJobDetailRoute = path.startsWith("/api/jobs/") && !path.contains("/recruiter/") && "GET".equalsIgnoreCase(method);
        boolean isAuthRoute = path.startsWith("/api/auth");

        if (isPublicJobRoute || isPublicJobDetailRoute || isAuthRoute) {
            chain.doFilter(request, response);
            return;
        }

        // 3. Authenticate protected routes
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = jwtUtil.extractClaims(token);
            if (jwtUtil.isTokenExpired(claims)) {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.getWriter().write("Token has expired");
                return;
            }

            // Attach claims to request attributes
            httpRequest.setAttribute("userId", jwtUtil.getUserId(claims));
            httpRequest.setAttribute("role", jwtUtil.getRole(claims));
            httpRequest.setAttribute("email", jwtUtil.getEmail(claims));

            chain.doFilter(request, response);
        } catch (Exception ex) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("Invalid token: " + ex.getMessage());
        }
    }
}
