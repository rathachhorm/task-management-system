package com.ratha.taskmanagementbackend.service.impl;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ratha.taskmanagementbackend.jwt.JwtService;
import com.ratha.taskmanagementbackend.model.User;
import com.ratha.taskmanagementbackend.model.dto.LoginRequest;
import com.ratha.taskmanagementbackend.model.dto.RefreshTokenRequest;
import com.ratha.taskmanagementbackend.model.dto.RegisterRequest;
import com.ratha.taskmanagementbackend.repository.UserRepository;
import com.ratha.taskmanagementbackend.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public Map<String, String> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new com.ratha.taskmanagementbackend.exception.BadRequestException("Email already exists");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user);

        return Map.of("message", "Registration successful");
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new com.ratha.taskmanagementbackend.exception.UnauthorizedException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return Map.of(
                "token", token,
                "refreshToken", refreshToken
        );
    }

    public Map<String, String> refresh(RefreshTokenRequest request) {
        String refreshToken = request.refreshToken();

        try {
            String username = jwtService.extractUsername(refreshToken);
            
            if (username != null) {
                User user = userRepository.findByEmail(username).orElse(null);
                
                if (user != null && jwtService.validateToken(refreshToken, user)) {
                    String newToken = jwtService.generateToken(user.getEmail());
                    String newRefreshToken = jwtService.generateRefreshToken(user.getEmail());
                    
                    return Map.of(
                            "token", newToken,
                            "refreshToken", newRefreshToken
                    );
                }
            }
        } catch (Exception e) {
            // invalid token
        }

        throw new com.ratha.taskmanagementbackend.exception.UnauthorizedException("Invalid refresh token");
    }
}
