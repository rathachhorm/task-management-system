package com.ratha.taskmanagementbackend.service.impl;

import com.ratha.taskmanagementbackend.model.Category;
import com.ratha.taskmanagementbackend.model.dto.CategoryRequest;
import com.ratha.taskmanagementbackend.repository.CategoryRepository;
import com.ratha.taskmanagementbackend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.name());
        return categoryRepository.save(category);
    }
}
