package com.is216.bookweb.utils;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtHelper {
     @Value("${security.jwt.secret-key}")
    private String secretString;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    public String generateToken(String data){
        System.out.println("secret: " + secretString);
        byte[] keyBytes = Decoders.BASE64.decode(secretString);
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);

        String jws = Jwts.builder()
                .issuedAt(new Date(System.currentTimeMillis()))
                .subject(data)
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key)
                .compact();

        return jws;    
    }

    public boolean verifyToken(String token) {

        
        SecretKey secret = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretString));

        try {
            
            Jwts.parser().verifyWith(secret).build().parseSignedClaims(token);
            
            return true;
       
        } catch (Exception e) {
            System.out.println(e.getMessage());
                return false;
        }
    }

    public String extractUsername(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretString);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
