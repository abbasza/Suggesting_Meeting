// Array to store the events added by the user
let events = [];

// Function to initialize the app on page load
function init() {
    // Load events from local storage (if any)
    loadEvents();
    
    // Render the calendar for the current month
    renderCalendar(new Date());
    
    // Attach event listeners
    document.getElementById('new-event-form').addEventListener('submit', handleNewEvent);
    document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
}

// Function to render the calendar based on the given date (current month by default)
function renderCalendar(date) {
    // Clear the existing calendar grid
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    // Get the first day and number of days in the current month
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    // Get the current month and year to display
    const currentMonthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    document.getElementById('current-month').textContent = currentMonthYear;

    // Create blank slots for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const blankSlot = document.createElement('div');
        blankSlot.classList.add('calendar-day', 'empty');
        calendarGrid.appendChild(blankSlot);
    }

    // Create slots for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const daySlot = document.createElement('div');
        daySlot.classList.add('calendar-day');
        daySlot.textContent = day;

        // Check if there are any events for this day
        const eventForDay = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day && eventDate.getMonth() === date.getMonth() && eventDate.getFullYear() === date.getFullYear();
        });

        // If there are events, highlight the day and display the event title
        if (eventForDay.length > 0) {
            daySlot.classList.add('has-event');
            const eventTitle = document.createElement('span');
            eventTitle.textContent = eventForDay[0].title;
            daySlot.appendChild(eventTitle);
        }

        calendarGrid.appendChild(daySlot);
    }
}

// Function to change the month (for navigation buttons)
let currentDate = new Date();
function changeMonth(direction) {
    // Increment or decrement the current month
    currentDate.setMonth(currentDate.getMonth() + direction);
    
    // Re-render the calendar for the new month
    renderCalendar(currentDate);
}

// Function to handle adding a new event when the form is submitted
function handleNewEvent(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get event details from the form
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;

    // Create a new event object
    const newEvent = {
        title: title,
        date: `${date}T${time}`,
    };

    // Add the new event to the array
    events.push(newEvent);

    // Save the events to local storage
    saveEvents();

    // Update the UI: Re-render the calendar and the schedule list
    renderCalendar(currentDate);
    renderScheduleList();

    // Clear the form fields
    document.getElementById('new-event-form').reset();
}

// Function to render the list of scheduled events
function renderScheduleList() {
    const scheduleList = document.getElementById('schedule-items');
    scheduleList.innerHTML = ''; // Clear the list before rendering

    // Loop through the events and create list items for each one
    events.forEach(event => {
        const listItem = document.createElement('li');
        const eventDate = new Date(event.date);
        listItem.textContent = `${event.title} - ${eventDate.toDateString()} at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        scheduleList.appendChild(listItem);
    });
}

// Function to save events to local storage
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Function to load events from local storage (if available)
function loadEvents() {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
        renderScheduleList(); // Render the schedule list upon loading
    }
}

// Initialize the app when the page is loaded
window.onload = init;
