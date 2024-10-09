// Creamos el contenedor donde vamos a alojar los datos
const reserve = document.getElementById('reserve');

// Creamos el formulario
const form = document.createElement('form');
form.id = 'reservation-form';

// Creamos el label de ingreso
const labelCheckIn = document.createElement('label');
labelCheckIn.setAttribute('for', 'check-in');
labelCheckIn.textContent = 'Fecha de Entrada';

// Creamos el input para la fecha de entrada
const inputCheckIn = document.createElement('input');
inputCheckIn.setAttribute('type', 'date');
inputCheckIn.id = 'check-in';
inputCheckIn.required = true;

// Creamos el label de salida
const labelCheckOut = document.createElement('label');
labelCheckOut.setAttribute('for', 'check-out');
labelCheckOut.textContent = 'Fecha de Salida';

// Creamos el input para la fecha de salida
const inputCheckOut = document.createElement('input');
inputCheckOut.setAttribute('type', 'date');
inputCheckOut.id = 'check-out';
inputCheckOut.required = true;

// Creamos el label para seleccionar la habitación
const labelRoomType = document.createElement('label');
labelRoomType.setAttribute('for', 'room-type');
labelRoomType.textContent = 'Tipo de Habitación';

// Creamos el select para seleccionar la habitación
const selectRoomType = document.createElement('select');
selectRoomType.id = 'room-type';

// Opciones de habitaciones
const options = ['individual', 'doble', 'suite'];
options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
    selectRoomType.appendChild(opt);
});

// Se crea el botón para realizar la reserva
const buttonSubmit = document.createElement('button');
buttonSubmit.setAttribute('type', 'submit');
buttonSubmit.textContent = 'Reservar';

// Agregamos los diferentes elementos al formulario
form.appendChild(labelCheckIn);
form.appendChild(inputCheckIn);
form.appendChild(labelCheckOut);
form.appendChild(inputCheckOut);
form.appendChild(labelRoomType);
form.appendChild(selectRoomType);
form.appendChild(buttonSubmit);

// Agregamos el formulario al contenedor principal
reserve.appendChild(form);

// Se crea un contenedor para mostrar las reservas realizadas
const reservationList = document.createElement('div');
reservationList.id = 'reservations-list';
reserve.appendChild(reservationList);

// Se añade un controlador de eventos para cuando se envía el formulario
form.addEventListener('submit', function(event) {
    event.preventDefault();
    crearReserva();
});

// Función para crear una nueva reserva
function crearReserva() {
    const checkInDate = document.getElementById('check-in').value;
    const checkOutDate = document.getElementById('check-out').value;
    const roomType = document.getElementById('room-type').value;

    // Validamos que las fechas tengan sentido
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        // Mostrar mensaje
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'La fecha de entrada debe ser anterior a la de salida.';
        errorMsg.style.color = 'red';
        reserve.appendChild(errorMsg);
        // Borrar mensaje después de 3 segundos
        setTimeout(() => errorMsg.remove(), 3000);
        return;
    }

    // Objeto con la reserva
    const reserva = { checkInDate, checkOutDate, roomType };

    // Obtener reservas del localStorage
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    // Agregar la nueva reserva al array
    reservas.push(reserva);

    // Guardar las reservas en localStorage
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Mostrar las reservas
    mostrarReservas();

    // Limpiar el formulario
    form.reset();
}

// Función para mostrar las reservas
const mostrarReservas = () => {
    const reservas = getReservas();
    
    // Limpiar la lista antes de mostrar
    reservationList.textContent = '';

    if (reservas.length === 0) {
        reservationList.textContent = 'No hay reservas realizadas.';
        return;
    }

    const reservasFormateadas = formatearReservas(reservas);

    // Crear lista de reservas
    const ul = document.createElement('ul');
    reservasFormateadas.forEach((reservaFormateada, index) => {
        const li = document.createElement('li');
        li.textContent = reservaFormateada;
        
        // Se crea un botón para eliminar cada reserva
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.id = 'delete-button';
        
        // Se le añade el evento click
        deleteButton.addEventListener('click', () => eliminarReserva(index));
        
        // Se agrega el botón de eliminar al elemento de la lista de reservas
        li.appendChild(deleteButton);
        ul.appendChild(li);
    });

    // Añadir la lista al contenedor
    reservationList.appendChild(ul);
}

// Función para eliminar la reserva
function eliminarReserva(index) {
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    // Elimina la reserva del array
    reservas.splice(index, 1);
    // Actualiza la lista de reservas
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Mostrar las reservas actualizadas
    mostrarReservas();
}

// Muestra las reservas al cargar la página
mostrarReservas();

// Se crea una validación para que las fechas no sean anteriores a la fecha actual
const today = new Date().toISOString().split('T')[0];
inputCheckIn.setAttribute('min', today);
inputCheckOut.setAttribute('min', today);

// Se crea una función para formatear las reservas
function formatearReservas(reservas) {
    return reservas.map(reserva => 
        `Reserva: Entrada - ${formatearFecha(reserva.checkInDate)}, Salida - ${formatearFecha(reserva.checkOutDate)}, Habitación - ${reserva.roomType.charAt(0).toUpperCase() + reserva.roomType.slice(1)}`
    );
}

// Función auxiliar para formatear la fecha al formato "DD/MM/YYYY" según la norma ISO 8601
function formatearFecha(fechaISO) {
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
}
