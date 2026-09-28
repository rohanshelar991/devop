const API_URL = '/api/tasks';

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});

// Fetch all tasks from backend
async function fetchTasks() {
    try {
        hideError();
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        showError('Unable to load tasks from server. Ensure Spring Boot backend is running.');
        console.error('Error fetching tasks:', error);
    }
}

// Render tasks into HTML list
function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const taskCounter = document.getElementById('task-count');

    taskList.innerHTML = '';
    taskCounter.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;

    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <div class="task-info">
                <div class="checkbox-icon">${task.completed ? '✓' : ''}</div>
                <span class="task-title">${escapeHtml(task.title)}</span>
            </div>
            <div class="task-actions">
                ${!task.completed ? `<button class="btn-complete" onclick="completeTask(${task.id})">Complete</button>` : ''}
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Add a new task
async function addTask(event) {
    event.preventDefault();
    const input = document.getElementById('task-title');
    const title = input.value.trim();

    if (!title) return;

    try {
        hideError();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title, completed: false })
        });

        if (!response.ok) {
            throw new Error(`Failed to add task: ${response.status}`);
        }

        input.value = '';
        fetchTasks();
    } catch (error) {
        showError('Failed to add task. Please try again.');
        console.error('Error adding task:', error);
    }
}

// Complete a task
async function completeTask(id) {
    try {
        hideError();
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT'
        });

        if (!response.ok) {
            throw new Error(`Failed to complete task: ${response.status}`);
        }

        fetchTasks();
    } catch (error) {
        showError('Failed to mark task as completed.');
        console.error('Error completing task:', error);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        hideError();
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete task: ${response.status}`);
        }

        fetchTasks();
    } catch (error) {
        showError('Failed to delete task.');
        console.error('Error deleting task:', error);
    }
}

// Utility: Show error message banner
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

// Utility: Hide error message banner
function hideError() {
    const errorElement = document.getElementById('error-message');
    errorElement.classList.add('hidden');
}

// Utility: Escape HTML characters to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}
