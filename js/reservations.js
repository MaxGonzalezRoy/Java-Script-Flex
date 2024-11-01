// Función para mostrar las reservas
function displayReservations() {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const reservationsListDiv = document.getElementById("reservations-list");
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

// Función para eliminar una reserva
function deleteReservation(index) {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    if (reservations[index]) {
        reservations.splice(index, 1); // Elimina la reserva seleccionada
        localStorage.setItem("reservations", JSON.stringify(reservations));
        displayReservations(); // Actualiza la lista de reservas
    } else {
        console.error("No se encontró la reserva para eliminar.");
    }
}

// Llama a esta función cuando se cargue el documento
document.addEventListener("DOMContentLoaded", displayReservations);