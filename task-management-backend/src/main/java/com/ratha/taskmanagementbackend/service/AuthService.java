package com.ratha.taskmanagementbackend.service;

import java.util.Map;

import com.ratha.taskmanagementbackend.model.dto.LoginRequest;
import com.ratha.taskmanagementbackend.model.dto.RefreshTokenRequest;
import com.ratha.taskmanagementbackend.model.dto.RegisterRequest;

public interface AuthService {
    
    Map<String, String> register(RegisterRequest request);

    Map<String, Object> login(LoginRequest request);
    
    Map<String, String> refresh(RefreshTokenRequest request);
}
