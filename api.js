// Base URL for the API (could be a remote server, or a mock API service)
const API_BASE_URL = 'https://mock-api.example.com/events';  // Replace with your actual API URL

// Function to fetch all events from the server (GET request)
async function fetchEventsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}`);
        if (!response.ok) {
            throw new Error('Failed to fetch events from the API');
        }

        // Convert the response data into a JavaScript object (assumed to be in JSON format)
        const events = await response.json();
        return events;  // Returns the array of events
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

// Function to save a new event to the server (POST request)
async function saveEventToAPI(event) {
    try {
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            throw new Error('Failed to save the event to the API');
        }

        // Return the response (or saved event) if needed
        return await response.json();
    } catch (error) {
        console.error('Error saving event:', error);
    }
}

// Function to update an existing event (PUT request)
async function updateEventOnAPI(eventId, updatedEvent) {
    try {
        const response = await fetch(`${API_BASE_URL}/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent),
        });

        if (!response.ok) {
            throw new Error('Failed to update the event');
        }

        // Return the updated event from the server
        return await response.json();
    } catch (error) {
        console.error('Error updating event:', error);
    }
}

// Function to delete an event from the server (DELETE request)
async function deleteEventFromAPI(eventId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${eventId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete the event');
        }

        return true;  // Event successfully deleted
    } catch (error) {
        console.error('Error deleting event:', error);
        return false;
    }
}

// Function to initialize the app with data from the API
async function initFromAPI() {
    // Fetch events from the API when the app starts
    const eventsFromAPI = await fetchEventsFromAPI();

    // If events were successfully fetched, update the events array
    if (eventsFromAPI.length > 0) {
        events = eventsFromAPI;  // Assuming "events" is the global array of events from app.js
        renderCalendar(currentDate);  // Re-render the calendar with the fetched events
        renderScheduleList();  // Render the schedule list with the fetched events
    }
}

// Example usage of the API functions:
// Adding event to the server
async function addEvent(event) {
    const savedEvent = await saveEventToAPI(event);  // Save event to API
    if (savedEvent) {
        events.push(savedEvent);  // Add the saved event to the local events array
        saveEvents();  // Save to localStorage as well
        renderCalendar(currentDate);  // Re-render calendar
        renderScheduleList();  // Update schedule list
    }
}

// Updating an event
async function updateEvent(eventId, updatedEvent) {
    const updated = await updateEventOnAPI(eventId, updatedEvent);
    if (updated) {
        // Update the event in the local events array
        const index = events.findIndex(event => event.id === eventId);
        if (index > -1) {
            events[index] = updated;  // Update event locally
            saveEvents();  // Save to localStorage
            renderCalendar(currentDate);  // Re-render calendar
            renderScheduleList();  // Update schedule list
        }
    }
}

// Deleting an event
async function deleteEvent(eventId) {
    const success = await deleteEventFromAPI(eventId);
    if (success) {
        // Remove the event from the local events array
        events = events.filter(event => event.id !== eventId);
        saveEvents();  // Save to localStorage
        renderCalendar(currentDate);  // Re-render calendar
        renderScheduleList();  // Update schedule list
    }
}
