package com.ratha.taskmanagementbackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ratha.taskmanagementbackend.model.User;
import com.ratha.taskmanagementbackend.repository.UserRepository;

@SpringBootApplication
public class TaskManagementBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagementBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner createDefaultUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User user = User.builder()
                        .name("Admin")
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("1234"))
                        .build();
                userRepository.save(user);
                System.out.println("Default user created: admin@gmail.com / 1234");
            }
        };
    }
}
