function displayRoomAvailability(container, roomAvailability) {
    container.innerHTML = ''; // Limpiar contenido previo
    for (const [roomType, availability] of Object.entries(roomAvailability)) {
        const roomElement = document.createElement('div');
        roomElement.innerHTML = `${roomType.charAt(0).toUpperCase() + roomType.slice(1)}: Total ${availability.total}, Reservados ${availability.reserved}`;
        container.appendChild(roomElement);
    }
}

function displayReservations(container, reservations) {
    container.innerHTML = ''; // Limpiar contenido previo
    reservations.forEach(reservation => {
        const reservationElement = document.createElement('div');
        reservationElement.innerHTML = `Reserva: ${reservation.checkInDate} - ${reservation.checkOutDate}, Habitación: ${reservation.roomType}`;
        container.appendChild(reservationElement);
    });
}

// Exporta las funciones de forma global
window.displayRoomAvailability = displayRoomAvailability;
window.displayReservations = displayReservations;