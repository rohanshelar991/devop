package com.rohan.todo.service;

import com.rohan.todo.model.Task;
import com.rohan.todo.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class handling business logic for To-Do tasks.
 */
@Service
public class TaskService {

    private final TaskRepository taskRepository;

    // Constructor Injection
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Retrieve all tasks from database.
     */
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    /**
     * Create a new task.
     */
    public Task createTask(Task task) {
        if (task.getCompleted() == null) {
            task.setCompleted(false);
        }
        return taskRepository.save(task);
    }

    /**
     * Mark a task as completed.
     */
    public Task completeTask(Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setCompleted(true);
            return taskRepository.save(task);
        }
        throw new RuntimeException("Task not found with id: " + id);
    }

    /**
     * Delete a task by ID.
     */
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }
}
