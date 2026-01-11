"""
Flask application with integrated Due Date Tracker Calendar
"""
from flask import Flask, render_template, jsonify, request
from calendar import DueDateCalendar
from datetime import datetime

app = Flask(__name__)

# Initialize the calendar component
calendar = DueDateCalendar(primary_color="#3498db", accent_color="#e74c3c")

# Add sample due dates
calendar.add_due_date(5, "Project Proposal", "Submit project proposal to manager", "high")
calendar.add_due_date(10, "Code Review", "Review pull requests from team", "normal")
calendar.add_due_date(15, "Team Meeting", "Weekly team sync-up meeting", "normal")
calendar.add_due_date(20, "Bug Fix Deadline", "Complete all reported bugs", "high")
calendar.add_due_date(25, "Documentation", "Update API documentation", "low", True)
calendar.add_due_date(28, "Release", "Production release v2.0", "high")


@app.route('/')
def index():
    """Render the main page with calendar"""
    calendar_data = calendar.get_calendar_data()
    return render_template('index.html', calendar=calendar_data)


@app.route('/api/calendar')
def get_calendar():
    """API endpoint to get calendar data"""
    return jsonify(calendar.to_dict())


@app.route('/api/add-due-date', methods=['POST'])
def add_due_date():
    """API endpoint to add a new due date"""
    data = request.json
    calendar.add_due_date(
        day=data.get('day'),
        title=data.get('title'),
        description=data.get('description', ''),
        priority=data.get('priority', 'normal'),
        completed=data.get('completed', False)
    )
    return jsonify({"status": "success", "message": "Due date added successfully"})


@app.route('/api/next-month', methods=['POST'])
def next_month():
    """Move to next month"""
    calendar.next_month()
    return jsonify(calendar.to_dict())


@app.route('/api/prev-month', methods=['POST'])
def prev_month():
    """Move to previous month"""
    calendar.prev_month()
    return jsonify(calendar.to_dict())


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
