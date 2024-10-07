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

