function createReservation(roomAvailability, checkInDate, checkOutDate, roomType, adults, minors) {
    // Lógica para crear una reserva
    if (roomAvailability[roomType].reserved >= roomAvailability[roomType].total) {
        throw new Error('Selected room is already reserved.');
    }
    
    // Crea el objeto de reserva
    const reservation = {
        checkInDate,
        checkOutDate,
        roomType,
        adults,
        minors
    };

    // Actualiza la disponibilidad de la habitación
    roomAvailability[roomType].reserved++;
    saveRoomAvailability(roomAvailability); // Asegúrate de guardar la disponibilidad actualizada

    // Almacena la reserva en localStorage
    const reservations = getReservations(); // Obtiene las reservas actuales
    reservations.push(reservation); // Agrega la nueva reserva
    localStorage.setItem('reservations', JSON.stringify(reservations)); // Guarda las reservas actualizadas en localStorage

    return reservation; // Devolver la reserva creada
}
