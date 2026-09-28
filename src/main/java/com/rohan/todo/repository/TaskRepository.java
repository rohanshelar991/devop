package com.rohan.todo.repository;

import com.rohan.todo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA Repository interface for Task entity.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
