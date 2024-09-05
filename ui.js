// Function to update the calendar grid in the UI when an event is added
function highlightEventDays() {
    // Get all calendar day elements
    const calendarDays = document.querySelectorAll('.calendar-day');

    // Loop through each day and check if there are events for that day
    calendarDays.forEach(day => {
        const dayNumber = parseInt(day.textContent);

        // If the day has an event, add the 'has-event' class to highlight it
        const eventForDay = events.find(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === dayNumber && 
                   eventDate.getMonth() === currentDate.getMonth() &&
                   eventDate.getFullYear() === currentDate.getFullYear();
        });

        if (eventForDay) {
            day.classList.add('has-event');
        } else {
            day.classList.remove('has-event');
        }
    });
}

// Function to clear the form inputs after submitting a new event
function clearForm() {
    document.getElementById('new-event-form').reset();
}

// Function to show a message when a new event is added
function showAddEventMessage() {
    const message = document.createElement('p');
    message.textContent = 'Event successfully added!';
    message.classList.add('success-message');

    // Append the message to the form section
    const formSection = document.getElementById('schedule-form');
    formSection.appendChild(message);

    // Remove the message after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Function to render the schedule list in the UI
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

// Function to display an error message when the form submission fails (optional)
function showErrorMessage(messageText) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = messageText;
    errorMessage.classList.add('error-message');

    // Append the error message to the form section
    const formSection = document.getElementById('schedule-form');
    formSection.appendChild(errorMessage);

    // Remove the error message after 3 seconds
    setTimeout(() => {
        errorMessage.remove();
    }, 3000);
}

// Attach event listeners related to the UI (e.g., form submission)
function attachUIEventListeners() {
    // Listen for form submission to add a new event
    document.getElementById('new-event-form').addEventListener('submit', function (e) {
        e.preventDefault();
        
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;

        if (!title || !date || !time) {
            showErrorMessage('Please fill in all the fields.');
            return;
        }

        // Create a new event object and push it to the events array
        const newEvent = {
            title: title,
            date: `${date}T${time}`
        };
        events.push(newEvent);
        saveEvents(); // Save to local storage

        // Clear the form and give user feedback
        clearForm();
        showAddEventMessage();
        
        // Re-render the calendar and schedule list with the new event
        renderCalendar(currentDate);
        renderScheduleList();
    });
}

// Initialize the UI logic (called in app.js or on page load)
function initUI() {
    // Highlight any event days when the app loads
    highlightEventDays();

    // Render the schedule list when the app starts
    renderScheduleList();

    // Attach any UI-specific event listeners
    attachUIEventListeners();
}

// Call initUI() after the app logic initializes
window.onload = initUI;
