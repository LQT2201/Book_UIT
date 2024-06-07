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
    JwtHelper jwtHelper;


    @Autowired
    CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getJwtFromRequest(request);

        if(token == null) {
            filterChain.doFilter(request, response);
            return ;
        }
        
        String username = jwtHelper.extractUsername(token);
        var user = customUserDetailsService.loadUserByUsername(username);

        if (token != null) {
            if (jwtHelper.verifyToken(token)) {
                System.out.println(user.getAuthorities());
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username,null,user.getAuthorities());
                SecurityContext securityContext = SecurityContextHolder.getContext();
                securityContext.setAuthentication(auth);
            }
            
        }
            
        filterChain.doFilter(request, response);  

    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        String token = null;
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            token =  bearerToken.substring(7);
        }
        return token;
    }

}