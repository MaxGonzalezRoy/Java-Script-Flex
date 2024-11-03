export function loadReservations() {
    return JSON.parse(localStorage.getItem("reservations")) || [];
}

export function saveReservations(reservations) {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

export function loadRoomAvailability() {
    let availability = JSON.parse(localStorage.getItem("roomAvailability"));
    if (!availability) {
        availability = {
            base: { total: 10, reserved: 0 },
            double: { total: 6, reserved: 0 },
            suite: { total: 4, reserved: 0 },
            family: { total: 4, reserved: 0 }
        };
        saveRoomAvailability(availability);
    }
    return availability;
}

export function saveRoomAvailability(availability) {
    localStorage.setItem("roomAvailability", JSON.stringify(availability));
}

export function reduceRoomAvailability(roomType) {
    const availability = loadRoomAvailability();
    if (availability[roomType] && availability[roomType].reserved < availability[roomType].total) {
        availability[roomType].reserved += 1;
        saveRoomAvailability(availability);
    } else {
        Toastify({
            text: "No hay habitaciones disponibles para el tipo de habitación seleccionado.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
            close: true
        }).showToast();
    }
}

export function increaseRoomAvailability(roomType) {
    const availability = loadRoomAvailability();
    if (availability[roomType] && availability[roomType].reserved > 0) {
        availability[roomType].reserved -= 1;
        saveRoomAvailability(availability);
    }
}