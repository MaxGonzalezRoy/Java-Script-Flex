function loadReservations() {
    return JSON.parse(localStorage.getItem("reservations")) || [];
}

function saveReservations(reservations) {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

function displayReservations() {
    const DateTime = luxon.DateTime;
    const reservations = loadReservations();
    
    const reservationsListDiv = document.getElementById("reservations-list");
    if (!reservationsListDiv) {
        console.error("El elemento 'reservations-list' no se encontró en el DOM.");
        return;
    }

    reservationsListDiv.innerHTML = "";
    if (reservations.length === 0) {
        reservationsListDiv.innerHTML = "<p>No hay reservas realizadas.</p>";
        return;
    }

    reservations.forEach((reservation, index) => {
        const checkInFormatted = DateTime.fromISO(reservation.checkIn).toLocaleString(DateTime.DATE_MED);
        const checkOutFormatted = DateTime.fromISO(reservation.checkOut).toLocaleString(DateTime.DATE_MED);

        const reservationItem = document.createElement("div");
        reservationItem.classList.add("reservation-item"); // Añadido para mejorar el estilo
        reservationItem.innerHTML = `
            <p>Reserva #${index + 1}</p>
            <p>Tipo: ${capitalizeFirstLetter(reservation.roomType)}</p>
            <p>Fecha de entrada: ${checkInFormatted}</p>
            <p>Fecha de salida: ${checkOutFormatted}</p>
            <p>Adultos: ${reservation.adults}, Menores: ${reservation.minors}</p>
            <button onclick="editReservation(${index})">Modificar</button>
            <button onclick="deleteReservation(${index})">Eliminar</button>
        `;
        reservationsListDiv.appendChild(reservationItem);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Al cargar la página, mostrar las reservas
document.addEventListener("DOMContentLoaded", function() {
    displayReservations();
});