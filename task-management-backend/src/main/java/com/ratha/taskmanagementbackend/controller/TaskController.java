package com.ratha.taskmanagementbackend.controller;

import com.ratha.taskmanagementbackend.model.TaskStatus;
import com.ratha.taskmanagementbackend.model.User;
import com.ratha.taskmanagementbackend.model.dto.TaskRequest;
import com.ratha.taskmanagementbackend.model.dto.TaskResponse;
import com.ratha.taskmanagementbackend.service.TaskService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskResponse> getTasks(
            @RequestParam(required = false) TaskStatus status,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return taskService.getTasks(status, user);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(
            @Valid @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(request, user));
    }

    @PutMapping("/{id}")
    public TaskResponse update(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return taskService.updateTask(id, request, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        taskService.deleteTask(id, user);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message", "Task deleted successfully"
                )
        );
    }
}
