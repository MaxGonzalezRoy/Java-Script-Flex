document.addEventListener('DOMContentLoaded', async () => {
    const reserveContainer = document.getElementById('reserve');
    const reservationList = document.getElementById('reservations-list');
    const roomAvailabilityContainer = document.getElementById('room-availability');

    // Cargar datos de habitaciones o inicializar disponibilidad
    let roomAvailability = await loadRoomData() || loadRoomAvailability();

    saveRoomAvailability(roomAvailability);
    displayRoomAvailability(roomAvailabilityContainer, roomAvailability);
    createReservationForm(reserveContainer, roomAvailability, reservationList, roomAvailabilityContainer);
});

// Función para mostrar mensajes de error
function showError(message) {
    const errorElement = document.createElement('p');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    document.getElementById('reserve').appendChild(errorElement);
    setTimeout(() => errorElement.remove(), 3000);
}

// Función para crear el formulario de reserva dinámicamente
function createReservationForm(container, roomAvailability, reservationList, roomAvailabilityContainer) {
    const form = document.createElement('form');
    form.id = 'reservation-form';

    const labels = [
        { text: 'Fecha de Check-In', type: 'date', name: 'check-in-date' },
        { text: 'Fecha de Check-Out', type: 'date', name: 'check-out-date' },
        { text: 'Tipo de Habitación', type: 'select', name: 'room-type', options: Object.keys(roomAvailability) },
        { text: 'Adultos', type: 'number', name: 'adults', min: 1 },
        { text: 'Menores', type: 'number', name: 'minors', min: 0 }
    ];

    labels.forEach(labelInfo => {
        const label = document.createElement('label');
        label.textContent = labelInfo.text;

        if (labelInfo.type === 'select') {
            const select = document.createElement('select');
            select.name = labelInfo.name;
            labelInfo.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
                select.appendChild(opt);
            });
            form.appendChild(label);
            form.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = labelInfo.type;
            input.name = labelInfo.name;
            if (labelInfo.min) input.min = labelInfo.min;
            form.appendChild(label);
            form.appendChild(input);
        }
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Reservar';
    form.appendChild(submitButton);

    container.appendChild(form);

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        try {
            const checkInDate = form['check-in-date'].value;
            const checkOutDate = form['check-out-date'].value;
            const roomType = form['room-type'].value;
            const adults = parseInt(form['adults'].value, 10);
            const minors = parseInt(form['minors'].value, 10);
            createReservation(roomAvailability, checkInDate, checkOutDate, roomType, adults, minors);
            displayReservations(reservationList, getReservations());
            displayRoomAvailability(roomAvailabilityContainer, roomAvailability);
        } catch (error) {
            console.error("Error in reservation:", error);
            showError(error.message);
        } finally {
            form.reset();
        }
    });
}

// Funciones globales
async function loadRoomData() {
    try {
        const response = await fetch('./data/rooms.json'); // Verifica la ruta
        if (!response.ok) throw new Error('Error loading room data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to load room data:", error);
        return null;
    }
}

function loadRoomAvailability() {
    // Lógica para cargar disponibilidad de habitaciones
    return JSON.parse(localStorage.getItem('roomAvailability')) || null;
}

function saveRoomAvailability(roomAvailability) {
    localStorage.setItem('roomAvailability', JSON.stringify(roomAvailability));
}

function getReservations() {
    return JSON.parse(localStorage.getItem('reservations')) || [];
}

function createReservation(roomAvailability, checkInDate, checkOutDate, roomType, adults, minors) {
    // Lógica para crear una reserva
    if (roomAvailability[roomType].reserved >= roomAvailability[roomType].total) {
        throw new Error('Selected room is already reserved.');
    }
    
    // Actualiza la disponibilidad
    roomAvailability[roomType].reserved++;
    saveRoomAvailability(roomAvailability);
    
    const reservation = {
        checkInDate,
        checkOutDate,
        roomType,
        adults,
        minors
    };
    
    // Almacena la reserva en localStorage
    const reservations = getReservations();
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    return reservation; // Devolver la reserva creada
}

function displayRoomAvailability(container, roomAvailability) {
    // Implementar lógica para mostrar la disponibilidad de habitaciones
}

function displayReservations(reservationList, reservations) {
    // Implementar lógica para mostrar las reservas
}