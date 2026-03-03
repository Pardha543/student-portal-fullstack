package com.pardha.student_portal.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.pardha.student_portal.users.Role;

import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Jwts;


@Service
public class JwtService {
	 private final SecretKey key;
	  private final long accessMinutes;
	  private final long refreshDays;

	  public JwtService(
	      @Value("${app.jwt.secret}") String secret,
	      @Value("${app.jwt.accessTokenMinutes}") long accessMinutes,
	      @Value("${app.jwt.refreshTokenDays}") long refreshDays
	  ) {
	    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	    this.accessMinutes = accessMinutes;
	    this.refreshDays = refreshDays;
	  }

	  public String accessToken(Long userId, String email, Role role) {
	    Instant now = Instant.now();
	    return Jwts.builder()
	        .subject(String.valueOf(userId))
	        .claim("email", email)
	        .claim("role", role.name())
	        .issuedAt(Date.from(now))
	        .expiration(Date.from(now.plus(accessMinutes, ChronoUnit.MINUTES)))
	        .signWith(key).compact();
	  }

	  public String refreshToken(Long userId) {
	    Instant now = Instant.now();
	    return Jwts.builder()
	        .subject(String.valueOf(userId))
	        .issuedAt(Date.from(now))
	        .expiration(Date.from(now.plus(refreshDays, ChronoUnit.DAYS)))
	        .signWith(key).compact();
	  }

	  public Long userIdFrom(String token) {
	    return Long.parseLong(
	        Jwts.parser().verifyWith(key).build()
	            .parseSignedClaims(token).getPayload().getSubject()
	    );
	  }
}
