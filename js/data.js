// Main container
const reserveContainer = document.getElementById('reserve');

// Available room counts and prices
const roomAvailability = {
    base: { total: 10, reserved: 0, price: 144 },   // Precio por noche
    double: { total: 6, reserved: 0, price: 189 },
    suite: { total: 4, reserved: 0, price: 214 },
    family: { total: 4, reserved: 0, price: 286 }  // Family room added and others removed
};

// Load room availability from localStorage
const loadRoomAvailability = () => {
    const storedAvailability = JSON.parse(localStorage.getItem('roomAvailability'));
    if (storedAvailability) {
        Object.assign(roomAvailability, storedAvailability);
    }
};
loadRoomAvailability();

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
const saveRoomAvailability = () => localStorage.setItem('roomAvailability', JSON.stringify(roomAvailability));

// Create form and its elements
const form = createElement('form', { id: 'reservation-form' });

// Create Check-In Date Input
const labelCheckIn = createElement('label', { for: 'check-in-date' }, 'Check-In Date');
const inputCheckInDate = createElement('input', { type: 'date', id: 'check-in-date', required: true });

// Create Check-Out Date Input
const labelCheckOut = createElement('label', { for: 'check-out-date' }, 'Check-Out Date');
const inputCheckOutDate = createElement('input', { type: 'date', id: 'check-out-date', required: true });

// Create Room Type Selector
const labelRoomType = createElement('label', { for: 'room-type' }, 'Room Type');
const selectRoomType = createElement('select', { id: 'room-type' });
updateRoomTypeOptions();

// Add fields for adults and minors
const labelAdults = createElement('label', { for: 'adults' }, 'Number of adults (+18):');
const inputAdults = createElement('input', { type: 'number', id: 'adults', min: '1', required: true });

const labelMinors = createElement('label', { for: 'minors' }, 'Number of minors:');
const inputMinors = createElement('input', { type: 'number', id: 'minors', min: '0' });

const buttonSubmit = createElement('button', { type: 'submit' }, 'Book');

// Add elements to the form
form.append(
    labelCheckIn, inputCheckInDate,
    labelCheckOut, inputCheckOutDate,
    labelRoomType, selectRoomType,
    labelAdults, inputAdults,
    labelMinors, inputMinors,
    buttonSubmit
);
reserveContainer.appendChild(form);

// Container to display reservations
const reservationList = createElement('div', { id: 'reservations-list' });
reserveContainer.appendChild(reservationList);

// Container to display room availability
const roomAvailabilityContainer = createElement('div', { id: 'room-availability' });
reserveContainer.appendChild(roomAvailabilityContainer);
displayRoomAvailability();

// Reload form on submit
form.addEventListener('submit', function(event) {
    event.preventDefault();
    createReservation();
});

// Function to create a new reservation
function createReservation() {
    const checkInDate = inputCheckInDate.value;
    const checkOutDate = inputCheckOutDate.value;
    const roomType = selectRoomType.value;
    const adults = parseInt(inputAdults.value, 10);
    const minors = parseInt(inputMinors.value, 10);

    // Validate check-in and check-out dates
    const checkInDateTime = new Date(checkInDate);
    const checkOutDateTime = new Date(checkOutDate);

    if (checkInDateTime >= checkOutDateTime) {
        showErrorMessage('Check-in date must be earlier than check-out date.');
        return;
    }

    // Check for overlapping reservations
    const reservations = getReservations();
    const isOverlapping = reservations.some(reservation => {
        return reservation.roomType === roomType &&
            ((checkInDateTime < reservation.checkOutDate && checkOutDateTime > reservation.checkInDate));
    });

    if (isOverlapping) {
        showErrorMessage(`The selected room is already reserved for the specified dates.`);
        return;
    }

    // Validate room availability
    if (roomAvailability[roomType].reserved >= roomAvailability[roomType].total) {
        showErrorMessage(`No more ${roomType} rooms available.`);
        return;
    }

    // Save the reservation
    reservations.push({ 
        checkInDate: checkInDateTime, 
        checkOutDate: checkOutDateTime, 
        roomType, 
        adults, 
        minors 
    });
    saveReservations(reservations);

    // Update room availability
    roomAvailability[roomType].reserved += 1;
    saveRoomAvailability();

    displayReservations();
    displayRoomAvailability();
    updateRoomTypeOptions();
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
        const nights = calculateNights(reservation.checkInDate, reservation.checkOutDate);
        const totalPrice = nights * roomAvailability[reservation.roomType].price;

        li.textContent = `Reservation: Check-In - ${formatDate(reservation.checkInDate)}, Check-Out - ${formatDate(reservation.checkOutDate)}, Room - ${reservation.roomType.charAt(0).toUpperCase() + reservation.roomType.slice(1)}, Adults: ${reservation.adults}, Minors: ${reservation.minors}, Total Price: $${totalPrice}`;
        
        const deleteButton = createElement('button', {}, 'Delete');
        deleteButton.addEventListener('click', () => deleteReservation(index, reservation.roomType));
        li.appendChild(deleteButton);
        ul.appendChild(li);
    });

    reservationList.appendChild(ul);
};

// Function to display room availability
function displayRoomAvailability() {
    roomAvailabilityContainer.textContent = '';
    Object.entries(roomAvailability).forEach(([roomType, { total, reserved, price }]) => {
        const availableRooms = total - reserved;
        const p = createElement(
            'p', {}, 
            `${roomType.charAt(0).toUpperCase() + roomType.slice(1)}: Available - ${availableRooms}, Reserved - ${reserved}, Price: $${price}`
        );
        roomAvailabilityContainer.appendChild(p);
    });
}

// Function to update room type options based on availability
function updateRoomTypeOptions() {
    selectRoomType.innerHTML = ''; // Clear existing options
    Object.entries(roomAvailability).forEach(([roomType, { total, reserved }]) => {
        const availableRooms = total - reserved;
        selectRoomType.appendChild(createElement('option', { value: roomType }, `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} - Available: ${availableRooms}`));
    });
}

// Function to calculate nights between two dates
function calculateNights(checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDifference = checkOut - checkIn;
    return timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
}

// Function to delete a reservation
function deleteReservation(index, roomType) {
    const reservations = getReservations();
    const reservationToDelete = reservations[index];

    // Update room availability based on the deleted reservation
    roomAvailability[roomType].reserved -= 1;
    saveRoomAvailability();

    // Remove the reservation from the list
    reservations.splice(index, 1);
    saveReservations(reservations);

    displayReservations();
    displayRoomAvailability();
    updateRoomTypeOptions();
}

// Show reservations when page loads
displayReservations();

// Validation to ensure dates are not earlier than today
const today = new Date().toISOString().split('T')[0];
inputCheckInDate.setAttribute('min', today);
inputCheckOutDate.setAttribute('min', today);

// Helper function to format the date
function formatDate(isoDate) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(isoDate).toLocaleDateString('en-US', options);
}

// Function to show error messages
function showErrorMessage(message) {
    alert(message);
}