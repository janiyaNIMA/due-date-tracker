# Due Date Tracker - Sample Project

A complete Flask-based web application demonstrating the reusable Due Date Tracker calendar component.

## 📋 Project Overview

This sample project showcases how to integrate the `DueDateCalendar` component into a Flask application. It includes:

- **calendar.py** - The reusable calendar component
- **app.py** - Flask application with API endpoints
- **HTML/CSS/JavaScript** - Interactive frontend

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Application

```bash
python app.py
```

The application will be available at: `http://127.0.0.1:5000`

## 📁 Project Structure

```
sample-project/
├── app.py                 # Flask application
├── calendar.py           # Reusable calendar component
├── requirements.txt      # Python dependencies
├── templates/
│   └── index.html       # Main HTML template
└── static/
    ├── style.css        # Calendar styling
    └── script.js        # Frontend JavaScript
```

## 🔧 How to Use the Calendar Component

### Basic Usage

```python
from calendar import DueDateCalendar

# Create a calendar instance
calendar = DueDateCalendar(month=1, year=2026)

# Add due dates
calendar.add_due_date(5, "Project Proposal", "Submit to manager", "high")
calendar.add_due_date(10, "Code Review", "Review PRs", "normal")

# Get calendar data
data = calendar.get_calendar_data()
```

### Customization

```python
# Custom colors
calendar = DueDateCalendar(
    primary_color="#667eea",
    accent_color="#764ba2"
)
```

### Navigation

```python
calendar.next_month()  # Move to next month
calendar.prev_month()  # Move to previous month
```

## 🎨 Features

- 📅 Interactive calendar view
- 📝 Add/manage tasks for specific days
- 🎯 Priority levels (Low, Normal, High)
- 🌈 Customizable colors
- 📱 Responsive design
- ⚡ Real-time updates
- 🔗 RESTful API endpoints

## 🌐 API Endpoints

### GET `/api/calendar`
Get current calendar data

**Response:**
```json
{
  "month": 1,
  "year": 2026,
  "month_name": "January",
  "weeks": [...],
  "due_dates": {...},
  "primary_color": "#3498db",
  "accent_color": "#e74c3c"
}
```

### POST `/api/add-due-date`
Add a new due date

**Request Body:**
```json
{
  "day": 15,
  "title": "Task Title",
  "description": "Task description",
  "priority": "high",
  "completed": false
}
```

### POST `/api/next-month`
Move to next month and get updated calendar

### POST `/api/prev-month`
Move to previous month and get updated calendar

## 🎯 Task Priorities

- **High** - Red (accent color)
- **Normal** - Orange (warning color)
- **Low** - Green (success color)

## 📱 Responsive Breakpoints

- Desktop: Full layout with sidebar
- Tablet: Adjusted grid layout
- Mobile: Single column layout

## 🔧 Customization Options

### Colors
Modify CSS variables in `style.css`:
```css
:root {
    --primary-color: #3498db;
    --accent-color: #e74c3c;
    ...
}
```

### Calendar Parameters
```python
DueDateCalendar(
    month=1,              # Month number (1-12)
    year=2026,           # Year
    primary_color="#3498db",      # Primary color
    accent_color="#e74c3c"        # Accent color
)
```

## 📦 Dependencies

- Flask 2.3.3 - Web framework
- Python 3.7+ - Programming language

## 🤝 Integration Guide

To integrate this component into your own Flask project:

1. Copy `calendar.py` to your project
2. Import and instantiate in your app:
   ```python
   from calendar import DueDateCalendar
   calendar = DueDateCalendar()
   ```
3. Add the HTML template elements
4. Include the CSS and JavaScript files

## 📝 License

This project is provided as a sample implementation.

## 🐛 Troubleshooting

### Calendar not displaying
- Ensure Flask is running: `python app.py`
- Check browser console for JavaScript errors
- Verify static files are being served correctly

### Tasks not saving
- Check browser network tab for API errors
- Verify POST endpoints are accessible
- Ensure form validation passes

## 🎓 Learning Resources

This project demonstrates:
- Flask routing and API endpoints
- Python class design and customization
- HTML/CSS responsive design
- JavaScript async/await and DOM manipulation
- Frontend-backend integration

## 📞 Support

For issues or questions, check the main project documentation or create an issue.
