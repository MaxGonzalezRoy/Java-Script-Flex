async function loadRoomData() {
    try {
        const response = await fetch('../data/rooms.json'); // Asegúrate de que la ruta es correcta
        if (!response.ok) throw new Error('Error loading room data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to load room data:", error);
        return null;
    }
}