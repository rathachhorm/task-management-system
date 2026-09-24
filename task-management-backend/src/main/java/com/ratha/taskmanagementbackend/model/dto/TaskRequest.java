package com.ratha.taskmanagementbackend.model.dto;

import com.ratha.taskmanagementbackend.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;

public record TaskRequest(
        @NotBlank
        String title,

        String description,

        Long categoryId,

        TaskStatus status
) {
}
