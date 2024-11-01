async function displayRoomAvailability() {
    const DateTime = luxon.DateTime;

    const reservations = loadReservations(); // Cargamos las reservas usando la función del archivo storage.js
    const roomAvailabilityDiv = document.getElementById("room-availability");

    if (!roomAvailabilityDiv) {
        console.error("El elemento de disponibilidad de habitaciones no se encontró.");

        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'No se encontró el elemento de disponibilidad de habitaciones.',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    const totalRooms = {
        base: 10,
        double: 6,
        suite: 4,
        family: 4
    };
    const availableRooms = { ...totalRooms };

    // Calculamos la disponibilidad restando las habitaciones reservadas
    reservations.forEach(reservation => {
        if (availableRooms[reservation.roomType] !== undefined) {
            availableRooms[reservation.roomType]--;
        }
    });

    // Actualizamos el HTML con la disponibilidad
    roomAvailabilityDiv.innerHTML = "<h3>Disponibilidad de Habitaciones:</h3>";
    for (const [roomType, availableCount] of Object.entries(availableRooms)) {
        roomAvailabilityDiv.innerHTML += `<p>${capitalizeFirstLetter(roomType)}: ${availableCount} disponibles</p>`;
    }

    // Mostrar un mensaje de éxito al usuario
    Toastify({
        text: "Habitaciones disponibles actualizadas exitosamente",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50"
    }).showToast();
}

// Formatea la fecha de la reserva
function formatDate(dateStr) {
    const DateTime = luxon.DateTime;
    const date = DateTime.fromISO(dateStr);
    return date.isValid ? date.toLocaleString(DateTime.DATE_MED) : "Fecha Inválida";
}

// Capitaliza la primera letra de un string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Muestra las reservas almacenadas
function displayReservations() {
    const reservations = loadReservations(); // Cargar reservas desde el almacenamiento
    const reservationsListDiv = document.getElementById("reservations-list");

    if (!reservationsListDiv) {
        console.error("El elemento 'reservations-list' no se encontró en el DOM.");
        return;
    }

    reservationsListDiv.innerHTML = "";
    reservations.forEach((reservation, index) => {
        const reservationItem = document.createElement("div");
        reservationItem.innerHTML = `
            <p>Reserva #${index + 1}</p>
            <p>Tipo: ${reservation.roomType}</p>
            <p>Fecha de entrada: ${formatDate(reservation.checkIn)}</p>
            <p>Fecha de salida: ${formatDate(reservation.checkOut)}</p>
            <p>Adultos: ${reservation.adults}, Menores: ${reservation.minors}</p>
            <button onclick="editReservation(${index})">Modificar</button>
            <button onclick="deleteReservation(${index})">Eliminar</button>
        `;
        reservationsListDiv.appendChild(reservationItem);
    });
}

// Ejecutar las funciones al cargar el contenido del DOM
document.addEventListener("DOMContentLoaded", function() {
    displayRoomAvailability(); // Mostrar disponibilidad de habitaciones
    displayReservations(); // Mostrar reservas existentes
});