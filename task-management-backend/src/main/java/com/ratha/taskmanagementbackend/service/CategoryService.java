package com.ratha.taskmanagementbackend.service;

import java.util.List;

import com.ratha.taskmanagementbackend.model.Category;
import com.ratha.taskmanagementbackend.model.dto.CategoryRequest;

public interface CategoryService {
    
    List<Category> getAllCategories();
    
    Category createCategory(CategoryRequest request);
}
