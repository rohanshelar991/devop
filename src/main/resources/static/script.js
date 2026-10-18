const API_URL = '/api/tasks';
let allTasks = [];
let activeFilter = 'all';
let searchTerm = '';

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('task-search').addEventListener('input', event => {
        searchTerm = event.target.value.trim().toLowerCase();
        renderTasks(allTasks);
    });
    document.querySelectorAll('.filter-tab').forEach(button => {
        button.addEventListener('click', () => {
            activeFilter = button.dataset.filter;
            document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.toggle('active', tab === button));
            renderTasks(allTasks);
        });
    });
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
        allTasks = tasks;
        renderTasks(tasks);
        setConnectionStatus(true);
    } catch (error) {
        setConnectionStatus(false);
        showError('Unable to load tasks from server. Ensure Spring Boot backend is running.');
        console.error('Error fetching tasks:', error);
    }
}

// Render tasks into HTML list
function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const taskCounter = document.getElementById('task-count');
    const taskLabel = document.getElementById('task-label');
    const completedCount = document.getElementById('completed-count');
    const progressValue = document.getElementById('progress-value');
    const progressRing = document.getElementById('progress-ring');

    const visibleTasks = tasks.filter(task => {
        const matchesFilter = activeFilter === 'all'
            || (activeFilter === 'active' && !task.completed)
            || (activeFilter === 'completed' && task.completed);
        return matchesFilter && (!searchTerm || task.title.toLowerCase().includes(searchTerm));
    });
    taskList.innerHTML = '';
    const completed = tasks.filter(task => task.completed).length;
    const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    taskCounter.textContent = tasks.length;
    taskLabel.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
    completedCount.textContent = completed;
    progressValue.textContent = `${progress}%`;
    progressRing.style.strokeDashoffset = 100.53 - (100.53 * progress / 100);

    document.getElementById('clear-completed').disabled = completed === 0;

    if (visibleTasks.length === 0) {
        emptyState.classList.remove('hidden');
        emptyState.querySelector('p').textContent = tasks.length === 0 ? 'Nothing here yet.' : 'No matching tasks.';
        emptyState.querySelector('small').textContent = tasks.length === 0 ? 'Add your first task above and make it real.' : 'Try another filter or search term.';
        return;
    }

    emptyState.classList.add('hidden');

    visibleTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.style.animationDelay = `${Math.min(index * 45, 225)}ms`;

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

async function clearCompleted() {
    const completedTasks = allTasks.filter(task => task.completed);
    if (!completedTasks.length) return;
    try {
        hideError();
        await Promise.all(completedTasks.map(task => fetch(`${API_URL}/${task.id}`, { method: 'DELETE' })));
        await fetchTasks();
    } catch (error) {
        showError('Failed to clear completed tasks. Please try again.');
        console.error('Error clearing completed tasks:', error);
    }
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
        await fetchTasks();
        input.focus();
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

        await fetchTasks();
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

        await fetchTasks();
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

function setConnectionStatus(connected) {
    const pill = document.getElementById('connection-pill');
    const label = document.getElementById('connection-label');
    pill.classList.toggle('offline', !connected);
    label.textContent = connected ? 'Live' : 'Offline';
}

// Utility: Escape HTML characters to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}
