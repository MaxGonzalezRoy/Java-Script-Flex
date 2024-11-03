import { displayErrorMessage, clearErrorMessage, validateGuests } from '../lib/lib.js';
import { loadRoomData, displayRoomAvailability } from './api.js';
import { reduceRoomAvailability, saveReservations, loadReservations, loadRoomAvailability } from './storage.js';
import { displayReservations } from './display.js';

document.addEventListener("DOMContentLoaded", function() {
    if (typeof luxon === 'undefined') {
        console.error("Luxon no está cargado correctamente.");
        return;
    }
    initializeApp();
    setupMinDates();
});

function initializeApp() {
    displayReservations();
    displayRoomAvailability();
    document.getElementById('reservation-form').addEventListener('submit', handleFormSubmit);
    setupRealTimeValidation();
}

function setupMinDates() {
    const today = luxon.DateTime.now().toISODate();
    document.getElementById('check-in-date').setAttribute('min', today);
    document.getElementById('check-out-date').setAttribute('min', today);
}

function setupRealTimeValidation() {
    const formInputs = document.querySelectorAll('#reservation-form input, #reservation-form select');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            clearErrorMessage();
        });
    });
}

function showToast(message, type = "success") {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: type === "success" ? "green" : "red",
    }).showToast();
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const checkInDate = document.getElementById('check-in-date').value;
    const checkOutDate = document.getElementById('check-out-date').value;
    const roomType = document.getElementById('room-type').value;
    const adults = parseInt(document.getElementById('adults').value);
    const minors = parseInt(document.getElementById('minors').value);

    const checkIn = luxon.DateTime.fromISO(checkInDate);
    const checkOut = luxon.DateTime.fromISO(checkOutDate);
    const today = luxon.DateTime.now();

    if (!checkIn.isValid || !checkOut.isValid) {
        showToast("Fechas inválidas. Por favor, verifica las fechas seleccionadas.", "error");
        return;
    }

    if (checkIn < today) {
        showToast("La fecha de ingreso no puede ser anterior a la fecha actual.", "error");
        return;
    }

    if (checkIn >= checkOut) {
        showToast("La fecha de salida debe ser posterior a la fecha de entrada.", "error");
        return;
    }

    const guestValidation = validateGuests(roomType, adults, minors);
    if (!guestValidation.isValid) {
        showToast(guestValidation.message, "error");
        return;
    }

    const roomAvailability = await loadRoomAvailability();
    if (!roomAvailability || !roomAvailability[roomType]) {
        showToast("No se pudo cargar la disponibilidad de habitaciones.", "error");
        return;
    }

    if (roomAvailability[roomType].reserved >= roomAvailability[roomType].total) {
        showToast("No hay habitaciones disponibles para el tipo de habitación seleccionado.", "error");
        return;
    }

    const reservation = createReservation(checkIn, checkOut, roomType, adults, minors);
    addReservation(reservation);

    reduceRoomAvailability(roomType);
    displayRoomAvailability();
    displayReservations();
    clearErrorMessage();

    Swal.fire({
        icon: 'success',
        title: 'Reserva Confirmada!',
        text: 'Tu reserva fue realizada con éxito.',
        confirmButtonText: 'OK'
    });
    showToast("Reserva realizada con éxito");
}

function createReservation(checkIn, checkOut, roomType, adults, minors) {
    return {
        checkInDate: checkIn.toISODate(),
        checkOutDate: checkOut.toISODate(),
        roomType,
        adults,
        minors
    };
}

function addReservation(reservation) {
    const reservations = loadReservations();
    reservations.push(reservation);
    saveReservations(reservations);
    console.log("Reserva añadida:", reservation);
}
