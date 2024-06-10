package com.is216.bookweb.config;

import org.springframework.web.filter.OncePerRequestFilter;

import com.is216.bookweb.utils.JwtHelper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.StringUtils;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;


/**
 * CustomJwtFilter
 */
@Component
public class CustomJwtFilter extends OncePerRequestFilter{

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // URLs to bypass the filter
        String[] bypassUrls = {"/login/**",  "/api/payment"};

        // Check if the request URL matches any of the bypass URLs
        for (String url : bypassUrls) {
            if (request.getRequestURI().startsWith(url)) {
                // Bypass the filter for this request
                filterChain.doFilter(request, response);
                return;
            }
        }

        String token = getJwtFromRequest(request);

        if (token != null) {
            String username = jwtHelper.extractUsername(token);
            if (username != null) {
                var user = customUserDetailsService.loadUserByUsername(username);
                if (jwtHelper.verifyToken(token)) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null, user.getAuthorities());
                    SecurityContext securityContext = SecurityContextHolder.getContext();
                    securityContext.setAuthentication(auth);
                }
            }
        }
        
        // Continue the filter chain
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
