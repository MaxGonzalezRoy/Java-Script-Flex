// Se crea una función para cambiar los nombres para que sean más fáciles de interpretar por el usuario
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
// Se crea un formulario en el cual se van a registrar los usuarios de la página y sus campos a solicitar
function formularioRegistro() {
    const campos = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    const valores = {};
    // Se recolectan y validan los datos de los usuarios
    for (let i = 0; i < campos.length; i++) {
        const campoActual = campos[i];
        const mensaje = `Por favor, ingresa tu ${nombresAdaptados(campoActual)}`;
        let valor;
        //Se crea un bucle en el cual si el usuario ingresa mal o no ingresa un dato segun el campo le retorna un mensaje especifico
        do {
            valor = prompt(mensaje);
            if (!valor) {
                alert(`El campo ${nombresAdaptados(campoActual)} no puede estar vacío.`);
            } else if (campoActual === 'email' && !verificarEmail(valor)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                valor = '';
            } else if (campoActual === 'phone' && !verificarTelefono(valor)) {
                alert('El teléfono solo debe contener números.');
                valor = '';
            }
        } while (!valor || (campoActual === 'email' && !verificarEmail(valor)) || (campoActual === 'phone' && !verificarTelefono(valor)));
        // Guarda el valor ingresado en el objeto "valores" correspondiente y se utiliza ".trim" para evitar los espacios en blanco
        valores[campoActual] = valor.trim();
    }
    if (Object.values(valores).some(valor => !valor)) {
        alert('Todos los campos requeridos deben ser completados.');
        return;
    }
    // Confirmación de contraseñas
    while (!verificarContraseñas(valores.password, valores.confirmPassword)) {
        alert('Las contraseñas no coinciden. Solo ingresa la confirmación de nuevo.');
        valores.confirmPassword = prompt('Por favor, confirma tu contraseña');
    }
    // Si todo es correcto
    alert('¡Inscripción completada con éxito!');
    console.log(`Datos registrados: Nombre: ${valores.name}, Correo: ${valores.email}, Teléfono: ${valores.phone}`);
}