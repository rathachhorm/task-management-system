package com.ratha.taskmanagementbackend.repository;

import com.ratha.taskmanagementbackend.model.Task;
import com.ratha.taskmanagementbackend.model.TaskStatus;
import com.ratha.taskmanagementbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserOrderByCreatedDateDesc(User user);

    List<Task> findByUserAndStatusOrderByCreatedDateDesc(
            User user,
            TaskStatus status
    );
}
