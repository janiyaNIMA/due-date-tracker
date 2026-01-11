/**
 * Due Date Tracker - Frontend JavaScript
 */

// State management
let currentCalendarData = null;
let selectedDay = null;

// DOM Elements
const calendarDiv = document.getElementById('calendar');
const monthYearDiv = document.getElementById('monthYear');
const tasksList = document.getElementById('tasksList');
const taskForm = document.getElementById('taskForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Event listeners
prevBtn.addEventListener('click', goToPreviousMonth);
nextBtn.addEventListener('click', goToNextMonth);
taskForm.addEventListener('submit', handleAddTask);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCalendar();
});

/**
 * Load and render the calendar
 */
async function loadCalendar() {
    try {
        const response = await fetch('/api/calendar');
        currentCalendarData = await response.json();
        renderCalendar();
    } catch (error) {
        console.error('Error loading calendar:', error);
    }
}

/**
 * Render the calendar grid
 */
function renderCalendar() {
    if (!currentCalendarData) return;

    // Clear calendar
    calendarDiv.innerHTML = '';

    // Update month/year header
    monthYearDiv.textContent = `${currentCalendarData.month_name} ${currentCalendarData.year}`;

    // Add day headers
    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        calendarDiv.appendChild(header);
    });

    // Add day cells
    currentCalendarData.weeks.forEach(week => {
        week.forEach(day => {
            const dayCell = document.createElement('div');
            
            if (day === null) {
                dayCell.className = 'day-cell empty';
            } else {
                dayCell.className = 'day-cell';
                dayCell.innerHTML = `<div class="day-number">${day}</div>`;

                // Check if this day has tasks
                if (currentCalendarData.due_dates[day]) {
                    dayCell.classList.add('has-tasks');
                    
                    // Add task indicators
                    const indicatorDiv = document.createElement('div');
                    indicatorDiv.className = 'task-indicator';
                    
                    currentCalendarData.due_dates[day].forEach(task => {
                        const dot = document.createElement('div');
                        dot.className = `task-dot ${task.priority}`;
                        indicatorDiv.appendChild(dot);
                    });
                    
                    dayCell.appendChild(indicatorDiv);
                }

                // Add click event
                dayCell.addEventListener('click', () => selectDay(day));

                // Highlight selected day
                if (selectedDay === day) {
                    dayCell.classList.add('selected');
                }
            }

            calendarDiv.appendChild(dayCell);
        });
    });
}

/**
 * Select a day and show its tasks
 */
function selectDay(day) {
    selectedDay = day;
    renderCalendar(); // Re-render to highlight selected day
    displayTasksForDay(day);
}

/**
 * Display tasks for the selected day
 */
function displayTasksForDay(day) {
    tasksList.innerHTML = '';

    const tasks = currentCalendarData.due_dates[day];

    if (!tasks || tasks.length === 0) {
        tasksList.innerHTML = '<p class="no-tasks">No tasks for this day</p>';
        return;
    }

    // Sort tasks by priority
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Render tasks
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.priority}`;
        if (task.completed) taskItem.classList.add('completed');

        taskItem.innerHTML = `
            <div class="task-title">${escapeHtml(task.title)}</div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <span class="task-priority">${task.priority.toUpperCase()}</span>
        `;

        tasksList.appendChild(taskItem);
    });
}

/**
 * Go to previous month
 */
async function goToPreviousMonth() {
    try {
        const response = await fetch('/api/prev-month', { method: 'POST' });
        currentCalendarData = await response.json();
        selectedDay = null;
        tasksList.innerHTML = '<p class="no-tasks">Select a day to view tasks</p>';
        renderCalendar();
    } catch (error) {
        console.error('Error navigating to previous month:', error);
    }
}

/**
 * Go to next month
 */
async function goToNextMonth() {
    try {
        const response = await fetch('/api/next-month', { method: 'POST' });
        currentCalendarData = await response.json();
        selectedDay = null;
        tasksList.innerHTML = '<p class="no-tasks">Select a day to view tasks</p>';
        renderCalendar();
    } catch (error) {
        console.error('Error navigating to next month:', error);
    }
}

/**
 * Handle adding a new task
 */
async function handleAddTask(e) {
    e.preventDefault();

    const day = parseInt(document.getElementById('taskDay').value);
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    const priority = document.getElementById('taskPriority').value;

    if (!day || day < 1 || day > 31) {
        alert('Please enter a valid day (1-31)');
        return;
    }

    if (!title.trim()) {
        alert('Please enter a task title');
        return;
    }

    try {
        const response = await fetch('/api/add-due-date', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                day,
                title,
                description,
                priority,
                completed: false
            })
        });

        if (response.ok) {
            // Reset form
            taskForm.reset();
            
            // Reload calendar
            await loadCalendar();
            
            // Select the newly added day
            selectDay(day);
            
            // Show success message
            showNotification('Task added successfully!', 'success');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Error adding task', 'error');
    }
}

/**
 * Show notification message
 */
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
