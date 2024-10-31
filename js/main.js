// Main container
const reserveContainer = document.getElementById('reserve');

// Create a constant with attributes
const createElement = (tag, attributes = {}, text = '') => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    element.textContent = text;
    return element;
};

// Storage functions
const getReservations = () => JSON.parse(localStorage.getItem('reservations')) || [];
const saveReservations = (reservations) => localStorage.setItem('reservations', JSON.stringify(reservations));

// Create form and its elements
const form = createElement('form', { id: 'reservation-form' });
const labelCheckIn = createElement('label', { for: 'check-in' }, 'Check-In Date');
const inputCheckIn = createElement('input', { type: 'date', id: 'check-in', required: true });
const labelCheckOut = createElement('label', { for: 'check-out' }, 'Check-Out Date');
const inputCheckOut = createElement('input', { type: 'date', id: 'check-out', required: true });
const labelRoomType = createElement('label', { for: 'room-type' }, 'Room Type');

// Room type options
const roomTypes = ['single', 'double', 'suite'];
const selectRoomType = createElement('select', { id: 'room-type' });
roomTypes.map(option => {
    selectRoomType.appendChild(createElement('option', { value: option }, option.charAt(0).toUpperCase() + option.slice(1)));
});

// Add fields for adults and minors
const labelAdults = createElement('label', { for: 'adults' }, 'Number of adults (+18):');
const inputAdults = createElement('input', { type: 'number', id: 'adults', min: '1', required: true });

const labelMinors = createElement('label', { for: 'minors' }, 'Number of minors:');
const inputMinors = createElement('input', { type: 'number', id: 'minors', min: '0' });

const buttonSubmit = createElement('button', { type: 'submit' }, 'Book');

// Add elements to the form
form.append(
    labelCheckIn, inputCheckIn,
    labelCheckOut, inputCheckOut,
    labelRoomType, selectRoomType,
    labelAdults, inputAdults,
    labelMinors, inputMinors,
    buttonSubmit
);
reserveContainer.appendChild(form);

// Container to display reservations
const reservationList = createElement('div', { id: 'reservations-list' });
reserveContainer.appendChild(reservationList);

// Reload form on submit
form.addEventListener('submit', function(event) {
    event.preventDefault();
    createReservation();
});

// Function to create a new reservation
function createReservation() {
    const checkInDate = inputCheckIn.value;
    const checkOutDate = inputCheckOut.value;
    const roomType = selectRoomType.value;
    const adults = parseInt(inputAdults.value, 10);
    const minors = parseInt(inputMinors.value, 10);

    // Validate check-in and check-out dates
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        showErrorMessage('Check-in date must be earlier than the check-out date.');
        return;
    }

    const reservations = getReservations();
    reservations.push({ checkInDate, checkOutDate, roomType, adults, minors });
    saveReservations(reservations);
    displayReservations();
    form.reset();
}

// Function to display reservations
const displayReservations = () => {
    const reservations = getReservations();
    reservationList.textContent = '';

    if (reservations.length === 0) {
        reservationList.textContent = 'No reservations made.';
        return;
    }

    const ul = document.createElement('ul');
    reservations.map((reservation, index) => {
        const li = document.createElement('li');
        li.textContent = `Reservation: Check-In - ${formatDate(reservation.checkInDate)}, Check-Out - ${formatDate(reservation.checkOutDate)}, Room - ${reservation.roomType.charAt(0).toUpperCase() + reservation.roomType.slice(1)}, Adults: ${reservation.adults}, Minors: ${reservation.minors}`;
        
        const deleteButton = createElement('button', {}, 'Delete');
        deleteButton.addEventListener('click', () => deleteReservation(index));
        li.appendChild(deleteButton);
        ul.appendChild(li);
    });

    reservationList.appendChild(ul);
};

// Function to delete a reservation
function deleteReservation(index) {
    const reservations = getReservations();
    reservations.splice(index, 1);
    saveReservations(reservations);
    displayReservations();
}

// Show reservations when page loads
displayReservations();

// Validation to ensure dates are not earlier than today
const today = new Date().toISOString().split('T')[0];
inputCheckIn.setAttribute('min', today);
inputCheckOut.setAttribute('min', today);

// Helper function to format the date
function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

// Optional error handling function
function showErrorMessage(message) {
    alert(message); // Can replace with a custom error display if preferred
}