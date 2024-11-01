// Función para guardar la reserva en el almacenamiento local
function saveReservation(reservation) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Función para mostrar las reservas actuales
function displayReservations() {
    const reservationsList = document.getElementById('reservations-list');
    reservationsList.innerHTML = ''; // Limpiar lista anterior

    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    if (reservations.length === 0) {
        reservationsList.innerHTML = '<p>No hay reservas realizadas.</p>';
        return;
    }

    reservations.forEach((reservation, index) => {
        const reservationItem = document.createElement('div');
        reservationItem.innerHTML = `
            <p>Fecha de entrada: ${reservation.checkIn}</p>
            <p>Fecha de salida: ${reservation.checkOut}</p>
            <p>Tipo de habitación: ${reservation.roomType}</p>
            <p>Adultos: ${reservation.adults}, Menores: ${reservation.minors}</p>
            <button onclick="editReservation(${index})">Editar</button>
            <button onclick="deleteReservation(${index})">Eliminar</button>
        `;
        reservationsList.appendChild(reservationItem);
    });
}

// Función para eliminar una reserva
function deleteReservation(index) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.splice(index, 1);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    displayReservations(); // Actualizar la lista de reservas
}

// Función para editar una reserva
function editReservation(index) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const reservation = reservations[index];

    // Rellenar el formulario con la reserva existente
    document.getElementById('check-in-date').value = reservation.checkIn;
    document.getElementById('check-out-date').value = reservation.checkOut;
    document.getElementById('room-type').value = reservation.roomType;
    document.getElementById('adults').value = reservation.adults;
    document.getElementById('minors').value = reservation.minors;

    // Eliminar la reserva actual y permitir la edición
    deleteReservation(index);
}

// Función para manejar el envío del formulario de reserva
document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const checkInDate = document.getElementById('check-in-date').value;
    const checkOutDate = document.getElementById('check-out-date').value;
    const roomType = document.getElementById('room-type').value;
    const adults = parseInt(document.getElementById('adults').value);
    const minors = parseInt(document.getElementById('minors').value);
    
    // Validar las fechas
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        // Mostrar mensaje de error en el formulario
        displayErrorMessage("La fecha de salida debe ser posterior a la fecha de entrada.");
        return;
    }

    // Verificar los límites de personas por tipo de habitación
    const maxOccupancy = {
        base: 2,
        double: 4,
        suite: 2,
        family: 4
    };

    // Comprobar si la suma de adultos y menores excede el límite
    const totalGuests = adults + minors;
    if (totalGuests > maxOccupancy[roomType]) {
        // Mostrar mensaje de error en el formulario
        displayErrorMessage(`El número total de personas (adultos + menores) no puede exceder ${maxOccupancy[roomType]} para una habitación de tipo ${roomType.charAt(0).toUpperCase() + roomType.slice(1)}.`);
        return;
    }

    // Crear un objeto de reserva
    const reservation = {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        roomType: roomType,
        adults: adults,
        minors: minors,
        reserved: true
    };

    // Guardar la reserva en el almacenamiento
    saveReservation(reservation);
    
    // Mostrar disponibilidad actualizada
    displayRoomAvailability();

    // Mostrar las reservas actuales
    displayReservations();

    // Limpiar el mensaje de error
    clearErrorMessage();
});

// Función para mostrar el mensaje de error
function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.innerText = message;
    errorMessageDiv.style.display = 'block';

    // Ocultar el mensaje después de 3 segundos
    setTimeout(clearErrorMessage, 3000);
}

// Función para limpiar el mensaje de error
function clearErrorMessage() {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.innerText = '';
    errorMessageDiv.style.display = 'none';
}

// Función para mostrar la disponibilidad de habitaciones
function displayRoomAvailability() {
    const roomAvailability = document.getElementById('room-availability');
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const totalRooms = {
        base: 10,
        double: 10,
        suite: 5,
        family: 5
    };
    
    // Contar las reservas por tipo de habitación
    const roomCounts = {
        base: 0,
        double: 0,
        suite: 0,
        family: 0
    };

    reservations.forEach(reservation => {
        roomCounts[reservation.roomType]++;
    });

    roomAvailability.innerHTML = '<h2>Disponibilidad de Habitaciones</h2>';
    for (const [type, count] of Object.entries(roomCounts)) {
        const available = totalRooms[type] - count;
        roomAvailability.innerHTML += `<p>${type.charAt(0).toUpperCase() + type.slice(1)}: ${available} disponibles</p>`;
    }
}

// Inicializar la visualización de reservas y disponibilidad
displayReservations();
displayRoomAvailability();

// Añadir eventos para controlar el total de personas
const adultsInput = document.getElementById('adults');
const minorsInput = document.getElementById('minors');
const roomTypeSelect = document.getElementById('room-type');
const submitButton = document.querySelector('button[type="submit"]');

// Mensaje de error
const errorMessageDiv = document.createElement('div');
errorMessageDiv.id = 'error-message';
errorMessageDiv.style.color = 'red';
errorMessageDiv.style.display = 'none'; // Inicialmente oculto
document.getElementById('reservation-form').appendChild(errorMessageDiv);

// Función para validar el total de personas
function validateTotalGuests() {
    const roomType = roomTypeSelect.value;
    const maxOccupancy = {
        base: 2,
        double: 4,
        suite: 2,
        family: 4
    };

    const totalGuests = parseInt(adultsInput.value) + parseInt(minorsInput.value || 0);
    
    if (totalGuests > maxOccupancy[roomType]) {
        submitButton.disabled = true;
        errorMessageDiv.innerText = `El número total de personas no puede exceder ${maxOccupancy[roomType]}.`;
        errorMessageDiv.style.display = 'block';
    } else {
        submitButton.disabled = false;
        clearErrorMessage(); // Limpiar mensaje de error si es válido
    }
}

// Añadir listeners para validar en tiempo real
adultsInput.addEventListener('input', validateTotalGuests);
minorsInput.addEventListener('input', validateTotalGuests);
roomTypeSelect.addEventListener('change', validateTotalGuests);