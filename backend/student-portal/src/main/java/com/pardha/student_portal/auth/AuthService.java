package com.pardha.student_portal.auth;

import com.pardha.student_portal.auth.dto.LoginRequest;
import com.pardha.student_portal.auth.dto.LoginResponse;
import com.pardha.student_portal.auth.dto.RefreshRequest;
import com.pardha.student_portal.security.JwtService;
import com.pardha.student_portal.users.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest req) {
        var user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // password check
        if (!encoder.matches(req.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String access = jwtService.accessToken(user.getId(), user.getEmail(), user.getRole());
        String refresh = jwtService.refreshToken(user.getId());

        return new LoginResponse(access, refresh, user.getRole().name(), user.getFullName());
    }

    public LoginResponse refresh(RefreshRequest req) {
        Long userId = jwtService.userIdFrom(req.refreshToken());
        var user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String access = jwtService.accessToken(user.getId(), user.getEmail(), user.getRole());
        String refresh = jwtService.refreshToken(user.getId());

        return new LoginResponse(access, refresh, user.getRole().name(), user.getFullName());
    }
}