// SE ESTABLECEN FUNCIONES DE VALIDACION PARA COMPLETAR EL FORMULARIO DE INSCRIPCION CORRECTAMENTE

// Verifica si el correo electrónico es válido
function verificarEmail(email) {
    // Declaramos una constante con una expresión regular para validar el formato del correo electrónico
    const simbolosEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Utilizamos el método ".test" para determinar si el email cumple con el formato requerido
    return simbolosEmail.test(email);
}

// Verifica si el teléfono es valido
function verificarTelefono(telefono) {
    // Declaramos una constante con una expresión regular para validar que el teléfono contenga solo los numeros deseados
    const simbolosTelefono = /^[0-9]+$/;
    // Utilizamos el método ".test" para determinar si el teléfono cumple con el formato requerido
    return simbolosTelefono.test(telefono);
}

// Verifica si la contraseña es valida
function verificarContraseñas(password, confirmPassword) {
    // Verifica si las dos contraseñas ingresadas coinciden 
    return password === confirmPassword;
}

// Cambia los nombres de los campos a un formato más amigable para el usuario
function nombresAdaptados(campo) {
    switch (campo) {
        case 'name': return 'nombre';
        case 'email': return 'correo electrónico';
        case 'phone': return 'teléfono';
        case 'password': return 'contraseña';
        case 'confirmPassword': return 'confirmar contraseña';
        default: return campo;
    }
}

// Función principal para el registro de usuarios
function formularioRegistro() {
    // Lista de campos requeridos para el registro
    const campos = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    // Objeto para almacenar los valores ingresados por el usuario
    const valores = {};
    
    //Se utiliza el evento ".lenght" para que recorra cada campo del atributo campos
    for (let i = 0; i < campos.length; i++) {
        const campoActual = campos[i];
        const mensaje = `Por favor, ingresa tu ${nombresAdaptados(campoActual)}`;
        let valor;

        // Solicita datos del usuario y valida la entrada
        do {
            valor = prompt(mensaje);
            if (valor === null) {
                // Si el usuario cancela el prompt, se muestra un mensaje y se detiene el registro
                alert('Registro cancelado.');
                return;
            }
            
            // Valida el valor ingresado dependiendo del campo
            switch (campoActual) {
                case 'name':
                case 'email':
                case 'phone':
                case 'password':
                case 'confirmPassword':
                    if (!valor) {
                        // Verifica que el campo no esté vacío
                        alert(`El campo ${nombresAdaptados(campoActual)} no puede estar vacío.`);
                        valor = '';
                    } else {
                        // Realiza validaciones específicas para email y teléfono
                        if (campoActual === 'email' && !verificarEmail(valor)) {
                            alert('Por favor, ingresa un correo electrónico válido.');
                            valor = '';
                        } else if (campoActual === 'phone' && !verificarTelefono(valor)) {
                            alert('El teléfono solo debe contener números.');
                            valor = '';
                        }
                    }
                    break;
                default:
                    break;
            }
        } while (!valor || (campoActual === 'email' && !verificarEmail(valor)) || (campoActual === 'phone' && !verificarTelefono(valor)));
        
        // Guarda el valor ingresado en el objeto "valores" y elimina espacios en blanco innecesarios con el elemento ".trim"
        valores[campoActual] = valor.trim();
    }

    // Verifica si todos los campos requeridos están completos
    if (Object.values(valores).some(valor => !valor)) {
        alert('Todos los campos requeridos deben ser completados.');
        return;
    }

    // Verifica que las contraseñas coincidan
    while (!verificarContraseñas(valores.password, valores.confirmPassword)) {
        alert('Las contraseñas no coinciden. Solo ingresa la confirmación de nuevo.');
        valores.confirmPassword = prompt('Por favor, confirma tu contraseña');
        if (valores.confirmPassword === null) {
            // Si el usuario cancela la confirmación de contraseña, se muestra un mensaje y se detiene el registro
            alert('Registro cancelado.');
            return;
        }
    }

    // Muestra un mensaje de éxito y los datos registrados
    alert('¡Inscripción completada con éxito!');
    alert(`Datos registrados:\nNombre: ${valores.name}\nCorreo: ${valores.email}\nTeléfono: ${valores.phone}`);
    console.log(`Datos registrados: Nombre: ${valores.name}, Correo: ${valores.email}, Teléfono: ${valores.phone}`);
}

// Inicia el formulario una vez que todos los datos han sido cargados correctamente, de esta manera se visualiza de una mejor manera sin inconvenientes
document.addEventListener('DOMContentLoaded', function() {
    formularioRegistro();
});