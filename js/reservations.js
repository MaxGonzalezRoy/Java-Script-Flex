function loadReservations() {
    return JSON.parse(localStorage.getItem("reservations")) || [];
}

function saveReservations(reservations) {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

function displayReservations() {
    const reservations = loadReservations();
    
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
            <p>Fecha de entrada: ${reservation.checkIn}</p>
            <p>Fecha de salida: ${reservation.checkOut}</p>
            <p>Adultos: ${reservation.adults}, Menores: ${reservation.minors}</p>
            <button onclick="editReservation(${index})">Modificar</button>
            <button onclick="deleteReservation(${index})">Eliminar</button>
        `;
        reservationsListDiv.appendChild(reservationItem);
    });
}

document.addEventListener("DOMContentLoaded", displayReservations);