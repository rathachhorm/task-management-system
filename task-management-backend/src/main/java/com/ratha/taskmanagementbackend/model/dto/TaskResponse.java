package com.ratha.taskmanagementbackend.model.dto;

import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String status,
        Long categoryId,
        String categoryName,
        LocalDateTime createdDate
) {
}
