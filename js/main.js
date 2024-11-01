document.addEventListener("DOMContentLoaded", function() {
    if (typeof luxon === 'undefined') {
        console.error("Luxon no está cargado correctamente.");
        return;
    }
    initializeApp();
});

function initializeApp() {
    const DateTime = luxon.DateTime;

    function saveReservation(reservation) {
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.push(reservation);
        localStorage.setItem('reservations', JSON.stringify(reservations));
    }

    function displayReservations() {
        const reservationsList = document.getElementById('reservations-list');
        reservationsList.innerHTML = '';

        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        if (reservations.length === 0) {
            reservationsList.innerHTML = '<p>No hay reservas realizadas.</p>';
            return;
        }

        reservations.forEach((reservation, index) => {
            const reservationItem = document.createElement('div');
            reservationItem.classList.add('reservation-item');
            reservationItem.innerHTML = `
                <p>Reserva #${index + 1}</p>
                <p>Tipo: ${capitalizeFirstLetter(reservation.roomType)}</p>
                <p>Fecha de entrada: ${formatDate(reservation.checkIn)}</p>
                <p>Fecha de salida: ${formatDate(reservation.checkOut)}</p>
                <p>Adultos: ${reservation.adults}, Menores: ${reservation.minors}</p>
                <button onclick="editReservation(${index})">Modificar</button>
                <button onclick="deleteReservation(${index})">Eliminar</button>
            `;
            reservationsList.appendChild(reservationItem);
        });
    }

    function deleteReservation(index) {
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        if (reservations[index]) {
            reservations.splice(index, 1);
            localStorage.setItem('reservations', JSON.stringify(reservations));
            displayReservations();
            displayRoomAvailability(); // Actualizar disponibilidad después de eliminar
        } else {
            console.error("No se encontró la reserva para eliminar.");
        }
    }

    function editReservation(index) {
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const reservation = reservations[index];

        document.getElementById('check-in-date').value = reservation.checkIn;
        document.getElementById('check-out-date').value = reservation.checkOut;
        document.getElementById('room-type').value = reservation.roomType;
        document.getElementById('adults').value = reservation.adults;
        document.getElementById('minors').value = reservation.minors;

        deleteReservation(index);
    }

    document.getElementById('reservation-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const checkInDate = document.getElementById('check-in-date').value;
        const checkOutDate = document.getElementById('check-out-date').value;
        const roomType = document.getElementById('room-type').value;
        const adults = parseInt(document.getElementById('adults').value);
        const minors = parseInt(document.getElementById('minors').value);

        const checkIn = DateTime.fromISO(checkInDate);
        const checkOut = DateTime.fromISO(checkOutDate);

        if (!checkIn.isValid || !checkOut.isValid) {
            displayErrorMessage("Fechas inválidas. Por favor, verifica las fechas seleccionadas.");
            return;
        }

        if (checkIn >= checkOut) {
            displayErrorMessage("La fecha de salida debe ser posterior a la fecha de entrada.");
            return;
        }

        const maxOccupancy = {
            base: 2,
            double: 4,
            suite: 2,
            family: 4
        };

        const totalGuests = adults + minors;
        if (totalGuests > maxOccupancy[roomType]) {
            displayErrorMessage(`El número total de personas (adultos + menores) no puede exceder ${maxOccupancy[roomType]} para una habitación de tipo ${capitalizeFirstLetter(roomType)}.`);
            return;
        }

        const reservation = {
            checkIn: checkIn.toISODate(),
            checkOut: checkOut.toISODate(),
            roomType: roomType,
            adults: adults,
            minors: minors,
            reserved: true
        };

        saveReservation(reservation);

        displayRoomAvailability(); // Actualizar disponibilidad al guardar reserva
        displayReservations(); // Mostrar reservas después de guardar

        clearErrorMessage();

        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'Reserva Confirmada!',
            text: 'Tu reserva fue realizada con éxito.',
            confirmButtonText: 'OK'
        });
    });

    function displayErrorMessage(message) {
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.innerText = message;
        errorMessageDiv.style.display = 'block';

        setTimeout(clearErrorMessage, 3000);
    }

    function clearErrorMessage() {
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.innerText = '';
        errorMessageDiv.style.display = 'none';
    }

    function formatDate(dateStr) {
        const DateTime = luxon.DateTime;
        const date = DateTime.fromISO(dateStr);
        return date.isValid ? date.toLocaleString(DateTime.DATE_MED) : "Fecha Inválida";
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Validación en tiempo real de los campos de fecha
    const adultsInput = document.getElementById('adults');
    const minorsInput = document.getElementById('minors');
    const roomTypeSelect = document.getElementById('room-type');
    const submitButton = document.querySelector('button[type="submit"]');

    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.id = 'error-message';
    errorMessageDiv.style.color = 'red';
    errorMessageDiv.style.display = 'none';
    document.getElementById('reservation-form').appendChild(errorMessageDiv);

    function validateTotalGuests() {
        const roomType = roomTypeSelect.value;
        const maxOccupancy = {
            base: 2,
            double: 4,
            suite: 2,
            family: 4
        };

        const totalGuests = parseInt(adultsInput.value) + parseInt(minorsInput.value || 0);

        if (totalGuests > maxOccupancy[roomType]) {
            submitButton.disabled = true;
            errorMessageDiv.innerText = `El número total de personas no puede exceder ${maxOccupancy[roomType]}.`;
            errorMessageDiv.style.display = 'block';
        } else {
            submitButton.disabled = false;
            clearErrorMessage();
        }
    }

    adultsInput.addEventListener('input', validateTotalGuests);
    minorsInput.addEventListener('input', validateTotalGuests);
    roomTypeSelect.addEventListener('change', validateTotalGuests);

    // Mostrar las reservas y disponibilidad al cargar la aplicación
    displayReservations(); // Mostrar reservas al iniciar
    displayRoomAvailability(); // Mostrar disponibilidad al iniciar
}