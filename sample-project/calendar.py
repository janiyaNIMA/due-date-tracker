"""
Due Date Tracker Calendar Component
Fully customizable calendar component for Flask applications
"""
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class DueDateCalendar:
    """Reusable due date tracker calendar component"""
    
    def __init__(self, month: Optional[int] = None, year: Optional[int] = None, 
                 primary_color: str = "#3498db", accent_color: str = "#e74c3c"):
        """
        Initialize the calendar component
        
        Args:
            month: Month number (1-12). Defaults to current month
            year: Year. Defaults to current year
            primary_color: Primary color for calendar styling
            accent_color: Accent color for due dates
        """
        now = datetime.now()
        self.month = month or now.month
        self.year = year or now.year
        self.primary_color = primary_color
        self.accent_color = accent_color
        self.due_dates: Dict[int, List[Dict]] = {}
        
    def add_due_date(self, day: int, title: str, description: str = "", 
                     priority: str = "normal", completed: bool = False):
        """
        Add a due date to the calendar
        
        Args:
            day: Day of the month (1-31)
            title: Title of the task
            description: Description of the task
            priority: Priority level (low, normal, high)
            completed: Whether the task is completed
        """
        if day not in self.due_dates:
            self.due_dates[day] = []
        
        self.due_dates[day].append({
            "title": title,
            "description": description,
            "priority": priority,
            "completed": completed
        })
    
    def get_calendar_data(self) -> Dict:
        """
        Get calendar data in dictionary format
        
        Returns:
            Dictionary containing calendar structure and due dates
        """
        # Get first day of month and total days
        first_day = datetime(self.year, self.month, 1)
        last_day = (first_day + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        # Get day of week for first day (0=Monday, 6=Sunday)
        start_weekday = first_day.weekday()
        total_days = last_day.day
        
        # Create weeks grid
        weeks = []
        current_week = [None] * start_weekday
        
        for day in range(1, total_days + 1):
            current_week.append(day)
            if len(current_week) == 7:
                weeks.append(current_week)
                current_week = []
        
        # Fill remaining days
        if current_week:
            current_week.extend([None] * (7 - len(current_week)))
            weeks.append(current_week)
        
        return {
            "month": self.month,
            "year": self.year,
            "month_name": first_day.strftime("%B"),
            "weeks": weeks,
            "due_dates": self.due_dates,
            "primary_color": self.primary_color,
            "accent_color": self.accent_color
        }
    
    def next_month(self):
        """Move to next month"""
        if self.month == 12:
            self.month = 1
            self.year += 1
        else:
            self.month += 1
    
    def prev_month(self):
        """Move to previous month"""
        if self.month == 1:
            self.month = 12
            self.year -= 1
        else:
            self.month -= 1
    
    def to_dict(self) -> Dict:
        """
        Convert calendar to dictionary format for JSON serialization
        
        Returns:
            Dictionary representation of the calendar
        """
        return self.get_calendar_data()
