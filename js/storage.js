let reservations = []; // Array para almacenar las reservas en memoria
let roomAvailability = {}; // Objeto para la disponibilidad de habitaciones

function saveRoomAvailability(availability) {
    roomAvailability = availability;
    localStorage.setItem('roomAvailability', JSON.stringify(roomAvailability));
}

function loadRoomAvailability() {
    const storedAvailability = localStorage.getItem('roomAvailability');
    if (storedAvailability) {
        roomAvailability = JSON.parse(storedAvailability);
    }
    return roomAvailability;
}

function saveReservation(reservation) {
    reservations.push(reservation);
    saveReservationsToStorage();
}

function getReservations() {
    return reservations;
}

function loadReservationsFromStorage() {
    const storedReservations = JSON.parse(localStorage.getItem('reservations'));
    if (storedReservations) {
        reservations = storedReservations;
    }
}

function saveReservationsToStorage() {
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Exporta las funciones de forma global
window.saveRoomAvailability = saveRoomAvailability;
window.loadRoomAvailability = loadRoomAvailability;
window.saveReservation = saveReservation;
window.getReservations = getReservations;
window.loadReservationsFromStorage = loadReservationsFromStorage;
window.saveReservationsToStorage = saveReservationsToStorage;

