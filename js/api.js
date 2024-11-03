import { loadRoomAvailability } from './storage.js';
import { capitalizeFirstLetter, formatCurrency } from '../lib/lib.js';

export async function loadRoomData() {
    try {
        const response = await fetch('../data/rooms.json');
        if (!response.ok) throw new Error('Error loading room data');
        const data = await response.json();

        return Object.keys(data).map(key => ({
            type: key,
            ...data[key],
            maxOccupancy: key === 'base' ? 2 : key === 'double' ? 4 : key === 'suite' ? 2 : 4
        }));
    } catch (error) {
        console.error("Failed to load room data:", error);
        return null;
    }
}

export async function displayRoomAvailability() {
    const availabilityList = document.getElementById('availability-list');
    availabilityList.innerHTML = '';

    const roomData = await loadRoomData();
    const roomAvailability = await loadRoomAvailability();

    if (!roomData) {
        availabilityList.innerHTML = '<p>Error al cargar los datos de las habitaciones.</p>';
        return;
    }

    roomData.forEach(room => {
        const availableRooms = room.total - (roomAvailability[room.type]?.reserved || 0);
        const roomItem = document.createElement('div');
        roomItem.className = 'reservation-item';
        roomItem.innerHTML = `
            <h3>${capitalizeFirstLetter(room.type)} (${availableRooms} disponibles)</h3>
            <p><strong>Descripción:</strong> ${room.description}</p>
            <p><strong>Capacidad Máxima:</strong> ${room.maxOccupancy} personas</p>
            <p><strong>Precio por Noche:</strong> ${formatCurrency(room.price)}</p>
            <p><strong>Total de Habitaciones:</strong> ${room.total}</p>
            <p><strong>Reservadas:</strong> ${roomAvailability[room.type]?.reserved || 0}</p>
        `;
        availabilityList.appendChild(roomItem);
    });
}
