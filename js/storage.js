// Almacena las reservas en localStorage y las muestra en el DOM
function displayReservations() {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    
    // Verifica que el elemento esté definido
    const reservationsListDiv = document.getElementById("reservations-list");
    if (!reservationsListDiv) {
        console.error("El elemento 'reservations-list' no se encontró en el DOM.");
        return;
    }

    reservationsListDiv.innerHTML = ""; // Limpia la lista antes de mostrar
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

// Llama a esta función cuando se cargue el documento
document.addEventListener("DOMContentLoaded", displayReservations);