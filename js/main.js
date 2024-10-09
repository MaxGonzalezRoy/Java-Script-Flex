// Contenedor principal
const reserve = document.getElementById('reserve');

// Creamos una constante con atributos
const createElement = (tag, attributes = {}, text = '') => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    element.textContent = text;
    return element;
};

// Funciones de almacenamiento
const getReservas = () => JSON.parse(localStorage.getItem('reservas')) || [];
const saveReservas = (reservas) => localStorage.setItem('reservas', JSON.stringify(reservas));

// Creación del formulario y sus elementos
const form = createElement('form', { id: 'reservation-form' });
const labelCheckIn = createElement('label', { for: 'check-in' }, 'Fecha de Entrada');
const inputCheckIn = createElement('input', { type: 'date', id: 'check-in', required: true });
const labelCheckOut = createElement('label', { for: 'check-out' }, 'Fecha de Salida');
const inputCheckOut = createElement('input', { type: 'date', id: 'check-out', required: true });
const labelRoomType = createElement('label', { for: 'room-type' }, 'Tipo de Habitación');

// Usando map para crear las opciones del select
const roomTypes = ['individual', 'doble', 'suite'];
const selectRoomType = createElement('select', { id: 'room-type' });
roomTypes.map(option => {
    selectRoomType.appendChild(createElement('option', { value: option }, option.charAt(0).toUpperCase() + option.slice(1)));
});
const buttonSubmit = createElement('button', { type: 'submit' }, 'Reservar');

// Añadimos los elementos al formulario
form.append(labelCheckIn, inputCheckIn, labelCheckOut, inputCheckOut, labelRoomType, selectRoomType, buttonSubmit);
reserve.appendChild(form);

// Contenedor para mostrar las reservas
const reservationList = createElement('div', { id: 'reservations-list' });
reserve.appendChild(reservationList);

// Recarga el formulario
form.addEventListener('submit', function(event) {
    event.preventDefault();
    crearReserva();
});

// Función para crear una nueva reserva
function crearReserva() {
    const checkInDate = inputCheckIn.value;
    const checkOutDate = inputCheckOut.value;
    const roomType = selectRoomType.value;

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        mostrarMensajeError('La fecha de entrada debe ser anterior a la de salida.');
        return;
    }

    const reservas = getReservas();
    reservas.push({ checkInDate, checkOutDate, roomType });
    saveReservas(reservas);
    mostrarReservas();
    form.reset();
}

// Función para mostrar las reservas usando map para formatearlas
const mostrarReservas = () => {
    const reservas = getReservas();
    reservationList.textContent = '';

    if (reservas.length === 0) {
        reservationList.textContent = 'No hay reservas realizadas.';
        return;
    }

    const ul = document.createElement('ul');
    reservas.map((reserva, index) => {
        const li = document.createElement('li');
        li.textContent = `Reserva: Entrada - ${formatearFecha(reserva.checkInDate)}, Salida - ${formatearFecha(reserva.checkOutDate)}, Habitación - ${reserva.roomType.charAt(0).toUpperCase() + reserva.roomType.slice(1)}`;
        
        const deleteButton = createElement('button', {}, 'Eliminar');
        deleteButton.addEventListener('click', () => eliminarReserva(index));
        li.appendChild(deleteButton);
        ul.appendChild(li);
    });

    reservationList.appendChild(ul);
};

// Función para eliminar la reserva
function eliminarReserva(index) {
    const reservas = getReservas();
    reservas.splice(index, 1);
    saveReservas(reservas);
    mostrarReservas();
}

// Mostrar reservas al cargar la página
mostrarReservas();

// Validación para que las fechas no sean anteriores a la fecha actual
const today = new Date().toISOString().split('T')[0];
inputCheckIn.setAttribute('min', today);
inputCheckOut.setAttribute('min', today);

// Función auxiliar para formatear la fecha
function formatearFecha(fechaISO) {
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
}