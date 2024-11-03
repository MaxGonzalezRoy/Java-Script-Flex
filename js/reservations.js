import { loadReservations, saveReservations } from './storage.js';
import { displayErrorMessage } from '../lib/lib.js';

let reservations = loadReservations() || [];

function addReservation(checkInDate, checkOutDate, roomType, adults, minors) {
    const reservation = { checkInDate, checkOutDate, roomType, adults, minors };
    reservations.push(reservation);
    saveReservations(reservations);
    renderReservations();
}

function deleteReservation(index) {
    if (index > -1 && index < reservations.length) {
        reservations.splice(index, 1);
        saveReservations(reservations);
        renderReservations();
    } else {
        console.error("Índice de reserva inválido para eliminar.");
    }
}

export { addReservation, deleteReservation };
