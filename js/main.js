



function iniciarFormulario() {
    const campos = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    const nombresAdaptados = {
        'name': 'nombre',
        'email': 'correo electrónico',
        'phone': 'teléfono',
        'password': 'contraseña',
        'confirmPassword': 'confirmar contraseña'
    };
    let valores = [];

    for (let i = 0; i < campos.length; i++) {
        let valor;
        const campoActual = campos[i];
        const mensajePrompt = `Por favor, ingresa tu ${nombresAdaptados[campoActual]}`;
        
        do {
            valor = prompt(mensajePrompt);
            if (campoActual === 'email' && !verificarEmail(valor)) {
                alert('Por favor, ingresa un correo electrónico válido.');
            } else if (campoActual === 'phone' && !verificarTelefono(valor)) {
                alert('El teléfono solo debe contener números.');
            } else if (!valor) {
                alert(`El campo ${nombresAdaptados[campoActual]} no puede estar vacío.`);
            }
        } while (
            (campoActual === 'email' && !verificarEmail(valor)) ||
            (campoActual === 'phone' && !verificarTelefono(valor)) ||
            !valor
        );
        
        valores.push(valor.trim());
    }

    let [name, email, phone, password, confirmPassword] = valores;

    if (!verificarCamposRequeridos(valores)) {
        alert('Todos los campos requeridos deben ser completados.');
        return;
    }

    while (!verificarContraseñas(password, confirmPassword)) {
        alert('Las contraseñas no coinciden. Solo ingresa la confirmación de nuevo.');
        confirmPassword = prompt('Por favor, confirma tu contraseña');
    }

    alert('¡Inscripción completada con éxito!');
    console.log(`Datos registrados: Nombre: ${name}, Correo: ${email}, Teléfono: ${phone}`);
}
