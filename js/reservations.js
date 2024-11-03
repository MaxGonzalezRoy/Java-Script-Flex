import { loadReservations, saveReservations, loadRoomAvailability, reduceRoomAvailability, increaseRoomAvailability } from './storage.js';
import { capitalizeFirstLetter, validateGuests, displayErrorMessage, clearErrorMessage } from '../lib/lib.js';
import { displayRoomAvailability } from './api.js';

let currentEditIndex = null;

export function displayReservations() {
    const reservations = loadReservations() || [];
    const container = document.getElementById('reservations-list');
    container.innerHTML = '';

    if (reservations.length === 0) {
        container.innerHTML = '<p>No hay reservas realizadas.</p>';
        return;
    }

    reservations.forEach((reservation, index) => {
        const reservationDiv = document.createElement('div');
        reservationDiv.className = 'reservation-item';
        reservationDiv.innerHTML = `
            <p><strong>Fecha de entrada:</strong> ${reservation.checkInDate} - 
            <strong>Fecha de salida:</strong> ${reservation.checkOutDate} - 
            <strong>Tipo de habitación:</strong> ${capitalizeFirstLetter(reservation.roomType)} - 
            <strong>Adultos:</strong> ${reservation.adults} - 
            <strong>Menores:</strong> ${reservation.minors}</p>
            <button onclick="openEditReservationModal(${index})">Modificar</button>
            <button onclick="deleteReservation(${index})">Eliminar</button>
        `;
        container.appendChild(reservationDiv);
    });
}

function openEditReservationModal(index) {
    currentEditIndex = index;
    const reservations = loadReservations();
    const reservation = reservations[index];

    const checkInInput = document.getElementById('edit-check-in-date');
    const checkOutInput = document.getElementById('edit-check-out-date');
    const roomTypeInput = document.getElementById('edit-room-type');
    const adultsInput = document.getElementById('edit-adults');
    const minorsInput = document.getElementById('edit-minors');

    if (!checkInInput || !checkOutInput || !roomTypeInput || !adultsInput || !minorsInput) {
        console.error("Uno o más elementos del formulario de edición no se encontraron en el DOM.");
        return;
    }

    // Asignar valores si los elementos existen
    checkInInput.value = reservation.checkInDate;
    checkOutInput.value = reservation.checkOutDate;
    roomTypeInput.value = reservation.roomType;
    adultsInput.value = reservation.adults;
    minorsInput.value = reservation.minors;

    // Mostrar el modal
    const editModal = document.getElementById('edit-reservation-modal');
    editModal.classList.add('show');
}

function closeEditReservationModal() {
    const editModal = document.getElementById('edit-reservation-modal');
    editModal.classList.remove('show');
    clearErrorMessage();
    currentEditIndex = null;
}

function handleEditFormSubmit(event) {
    event.preventDefault();

    const checkInDate = document.getElementById('edit-check-in-date').value;
    const checkOutDate = document.getElementById('edit-check-out-date').value;
    const roomType = document.getElementById('edit-room-type').value;
    const adults = parseInt(document.getElementById('edit-adults').value);
    const minors = parseInt(document.getElementById('edit-minors').value);

    const checkIn = luxon.DateTime.fromISO(checkInDate);
    const checkOut = luxon.DateTime.fromISO(checkOutDate);
    const today = luxon.DateTime.now();

    if (!checkIn.isValid || !checkOut.isValid) {
        Swal.fire("Error en Fechas", "Fechas inválidas. Por favor verifica las fechas ingresadas.", "error");
        return;
    }

    if (checkIn < today) {
        Swal.fire("Fecha Incorrecta", "La fecha de ingreso no puede ser posterior al dia de la fecha.", "error");
        return;
    }

    if (checkIn >= checkOut) {
        Swal.fire("Error de Fechas", "La fecha de salida debe ser posterior a la fecha de ingreso.", "error");
        return;
    }

    const guestValidation = validateGuests(roomType, adults, minors);
    if (!guestValidation.isValid) {
        Swal.fire("Capacidad de personas por habitacion excedida", guestValidation.message, "error");
        return;
    }

    const roomAvailability = loadRoomAvailability();
    if (!roomAvailability[roomType] || roomAvailability[roomType].reserved >= roomAvailability[roomType].total) {
        Swal.fire("Sin Disponibilidad", "No hay habitaciones disponibles para el tipo seleccionado. Por favor elija otra habitacion.", "error");
        return;
    }

    const reservations = loadReservations();
    const oldRoomType = reservations[currentEditIndex].roomType;

    if (oldRoomType !== roomType) {
        increaseRoomAvailability(oldRoomType);
        reduceRoomAvailability(roomType);
    }

    reservations[currentEditIndex] = {
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        roomType: roomType,
        adults: adults,
        minors: minors
    };

    saveReservations(reservations);
    closeEditReservationModal();

    displayReservations();
    displayRoomAvailability();

    Swal.fire('Actualización Exitosa', 'La reserva ha sido modificada.', 'success');
}

function deleteReservation(index) {
    const reservations = loadReservations();
    if (index >= 0 && index < reservations.length) {
        const roomType = reservations[index].roomType;
        
        increaseRoomAvailability(roomType);

        reservations.splice(index, 1);
        saveReservations(reservations);
        
        displayReservations();
        displayRoomAvailability();

        Swal.fire('Eliminado', 'La reserva ha sido eliminada.', 'success');
    } else {
        console.error("Índice de reserva inválido para eliminar.");
    }
}

document.getElementById('edit-reservation-form').addEventListener('submit', handleEditFormSubmit);

window.openEditReservationModal = openEditReservationModal;
window.closeEditReservationModal = closeEditReservationModal;
window.deleteReservation = deleteReservation;
