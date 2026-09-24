package com.ratha.taskmanagementbackend.service;

import com.ratha.taskmanagementbackend.model.TaskStatus;
import com.ratha.taskmanagementbackend.model.User;
import com.ratha.taskmanagementbackend.model.dto.TaskRequest;
import com.ratha.taskmanagementbackend.model.dto.TaskResponse;

import java.util.List;

public interface TaskService {

    List<TaskResponse> getTasks(TaskStatus status, User user);

    TaskResponse createTask(TaskRequest request, User user);

    TaskResponse updateTask(Long id, TaskRequest request, User user);
    
    void deleteTask(Long id, User user);
}
