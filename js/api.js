// Función para cargar los datos de las habitaciones desde un archivo JSON
async function loadRoomData() {
    try {
        const response = await fetch('../data/rooms.json');
        if (!response.ok) throw new Error('Error loading room data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to load room data:", error);
        return null;
    }
}

// Ejemplo de función para obtener disponibilidad de habitaciones
function fetchRoomAvailability() {
    // Lógica para obtener la disponibilidad de habitaciones
    // Aquí puedes implementar la lógica para verificar qué habitaciones están disponibles
    // Esto podría implicar comparar la disponibilidad con las reservas existentes
    // Puedes usar loadRoomData para obtener los datos de las habitaciones

    loadRoomData().then(roomData => {
        if (roomData) {
            // Aquí puedes procesar roomData y determinar la disponibilidad
            console.log(roomData); // Para ver los datos cargados
        }
    }).catch(error => {
        console.error("Error fetching room availability:", error);
    });
}

// Puedes agregar más funciones relacionadas con la API según sea necesario