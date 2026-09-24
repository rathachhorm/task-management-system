package com.ratha.taskmanagementbackend.service.impl;

import com.ratha.taskmanagementbackend.model.Category;
import com.ratha.taskmanagementbackend.model.Task;
import com.ratha.taskmanagementbackend.model.TaskStatus;
import com.ratha.taskmanagementbackend.model.User;
import com.ratha.taskmanagementbackend.model.dto.TaskRequest;
import com.ratha.taskmanagementbackend.model.dto.TaskResponse;
import com.ratha.taskmanagementbackend.repository.CategoryRepository;
import com.ratha.taskmanagementbackend.repository.TaskRepository;
import com.ratha.taskmanagementbackend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;

    public List<TaskResponse> getTasks(TaskStatus status, User user) {
        List<Task> tasks = status == null
                ? taskRepository.findByUserOrderByCreatedDateDesc(user)
                : taskRepository.findByUserAndStatusOrderByCreatedDateDesc(user, status);

        return tasks.stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse createTask(TaskRequest request, User user) {
        Category category = null;

        if (request.categoryId() != null) {
            category = categoryRepository
                    .findById(request.categoryId())
                    .orElseThrow(() -> new com.ratha.taskmanagementbackend.exception.NotFoundException("Category not found"));
        }

        Task task = Task.builder()
                .title(request.title())
                .description(request.description())
                .status(
                        request.status() == null
                                ? TaskStatus.PENDING
                                : request.status()
                )
                .category(category)
                .user(user)
                .build();

        taskRepository.save(task);

        return toResponse(task);
    }

    public TaskResponse updateTask(Long id, TaskRequest request, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new com.ratha.taskmanagementbackend.exception.NotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new com.ratha.taskmanagementbackend.exception.UnauthorizedException("Access denied");
        }

        task.setTitle(request.title());
        task.setDescription(request.description());

        if (request.status() != null) {
            task.setStatus(request.status());
        }

        if (request.categoryId() != null) {
            task.setCategory(
                    categoryRepository
                            .findById(request.categoryId())
                            .orElseThrow(() -> new com.ratha.taskmanagementbackend.exception.NotFoundException("Category not found"))
            );
        } else {
            task.setCategory(null);
        }

        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new com.ratha.taskmanagementbackend.exception.NotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new com.ratha.taskmanagementbackend.exception.UnauthorizedException("Access denied");
        }

        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus().name(),
                task.getCategory() != null
                        ? task.getCategory().getId()
                        : null,
                task.getCategory() != null
                        ? task.getCategory().getName()
                        : null,
                task.getCreatedDate()
        );
    }
}
