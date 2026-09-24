package com.ratha.taskmanagementbackend.repository;

import com.ratha.taskmanagementbackend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
