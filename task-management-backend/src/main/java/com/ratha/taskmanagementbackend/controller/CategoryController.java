package com.ratha.taskmanagementbackend.controller;

import com.ratha.taskmanagementbackend.model.Category;
import com.ratha.taskmanagementbackend.service.CategoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAllCategories();
    }

    @PostMapping
    public Category create(@Valid @RequestBody com.ratha.taskmanagementbackend.model.dto.CategoryRequest request) {
        return categoryService.createCategory(request);
    }
}
