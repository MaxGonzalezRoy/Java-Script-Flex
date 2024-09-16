// Función principal que inicializa el proceso
function iniciarFormulario() {
    // Definir las constantes y variables necesarias
    const campos = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    const nombresAdaptados = {
        'name': 'nombre',
        'email': 'correo electrónico',
        'phone': 'teléfono',
        'password': 'contraseña',
        'confirmPassword': 'confirmar contraseña'
    };
    let valores = [];

    // Recolectar datos del formulario con prompt y almacenarlos en un array
    for (let i = 0; i < campos.length; i++) {
        let valor;
        const campoActual = campos[i];
        const mensajePrompt = `Por favor, ingresa tu ${nombresAdaptados[campoActual]}`;
        
        if (campoActual === 'email') {
            do {
                valor = prompt(mensajePrompt);
                if (!verificarEmail(valor)) {
                    alert('Por favor, ingresa un correo electrónico válido.');
                }
            } while (!verificarEmail(valor)); // Verificación inmediata del correo
        } else if (campoActual === 'phone') {
            do {
                valor = prompt(mensajePrompt);
                if (!verificarTelefono(valor)) {
                    alert('El teléfono solo debe contener números.');
                }
            } while (!verificarTelefono(valor)); // Verificación inmediata del teléfono
        } else {
            valor = prompt(mensajePrompt);
        }
        
        valores.push(valor.trim());
    }

    // Desestructurar el array para obtener los valores individuales
    let [name, email, phone, password, confirmPassword] = valores;

    // Verificar si los campos están completos
    if (!verificarCamposRequeridos(valores)) {
        alert('Todos los campos requeridos deben ser completados.');
        console.log('Error: Campos incompletos');
        return;
    }

    // Confirmación de contraseñas
    while (!verificarContraseñas(password, confirmPassword)) {
        alert('Las contraseñas no coinciden. Vuelve a intentarlo.');
        password = prompt('Por favor, ingresa tu contraseña');
        confirmPassword = prompt('Por favor, confirma tu contraseña');
    }

    // Si todo está correcto
    alert('¡Inscripción completada con éxito!');
    console.log(`Datos registrados: Nombre: ${name}, Correo: ${email}, Teléfono: ${phone}`);
}

// Función para verificar que todos los campos estén llenos
function verificarCamposRequeridos(valores) {
    for (let i = 0; i < valores.length; i++) {
        if (!valores[i]) {
            return false;
        }
    }
    return true;
}

// Función para verificar que las contraseñas coincidan
function verificarContraseñas(contraseña, confirmarContraseña) {
    return contraseña === confirmarContraseña;
}

// Función para verificar que el formato del correo electrónico sea válido
function verificarEmail(correoElectronico) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(correoElectronico);
}

// Función para verificar que el número de teléfono contenga solo números
function verificarTelefono(telefono) {
    const telefonoPattern = /^[0-9]+$/; // Acepta solo números
    return telefonoPattern.test(telefono);
}

// Iniciar el formulario
iniciarFormulario();