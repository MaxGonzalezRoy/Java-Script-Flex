// Función para mostrar la disponibilidad de habitaciones
function displayRoomAvailability() {
    const reservations = loadReservations(); // Cargar las reservas del almacenamiento local
    const roomAvailabilityDiv = document.getElementById("room-availability");
    
    if (!roomAvailabilityDiv) {
        console.error("El elemento de disponibilidad de habitaciones no se encontró.");
        return; // Asegúrate de que el elemento exista
    }

    const totalRooms = {
        base: 10, // Número total de habitaciones de tipo base
        double: 10, // Número total de habitaciones de tipo double
        suite: 10, // Número total de habitaciones de tipo suite
        family: 10 // Número total de habitaciones de tipo family
    };
    const availableRooms = { ...totalRooms };

    reservations.forEach(reservation => {
        availableRooms[reservation.roomType]--;
    });

    roomAvailabilityDiv.innerHTML = "<h3>Disponibilidad de Habitaciones:</h3>";
    for (const [roomType, availableCount] of Object.entries(availableRooms)) {
        roomAvailabilityDiv.innerHTML += `<p>${roomType.charAt(0).toUpperCase() + roomType.slice(1)}: ${availableCount} disponibles</p>`;
    }
}

// Cargar y mostrar disponibilidad al cargar el documento
document.addEventListener("DOMContentLoaded", function() {
    displayRoomAvailability();
});