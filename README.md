# Sistema de Reservas de Hotel

## Descripción

Este proyecto es una implementación de un sistema de reservas de hotel en JavaScript. Los usuarios pueden seleccionar el tipo de habitación que desean reservar y cancelar la reserva si lo necesitan. El objetivo es ofrecer una experiencia de usuario sencilla y eficiente, permitiendo gestionar las reservas de manera rápida.

## Funcionalidades

- **Selección de Tipo de Habitación:** Los usuarios eligen entre diferentes tipos de habitaciones.
- **Cancelación de Reservas:** Permite eliminar reservas realizadas anteriormente.
- **Formulario de Reservas:** Valida los datos ingresados antes de finalizar la reserva.
- **Notificaciones de Confirmación:** Muestra mensajes según el estado de la reserva.

## Lógica de Reservas

El sistema utiliza JavaScript para gestionar las reservas con las siguientes características clave:

- **Almacenamiento Local:** Las reservas se guardan en `localStorage`, manteniéndolas entre sesiones.
- **Validación de Fechas:** Verifica que la fecha de entrada sea anterior a la de salida y que ambas no sean anteriores a la fecha actual.
- **Interacción Dinámica:** El formulario y la lista de reservas se actualizan en tiempo real sin recargar la página.
- **Eliminación de Reservas:** Los usuarios pueden eliminar una reserva específica desde la lista.
- **Formateo de Fechas:** Las fechas se formatean de forma amigable para el usuario.

Para más detalles, puede consultar el código en el [repositorio de GitHub](https://github.com/MaxGonzalezRoy/Java-Script-Flex.git).

Atentamente,

Maximiliano Gonzalez Roy