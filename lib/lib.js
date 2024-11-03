const { DateTime } = luxon;

export function formatDate(dateStr) {
    const date = DateTime.fromISO(dateStr);
    return date.isValid ? date.toFormat("dd MMMM yyyy") : "Fecha Inválida";
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function validateGuests(roomType, adults, minors) {
    const maxOccupancy = {
        base: 2,
        double: 4,
        suite: 2,
        family: 4
    }[roomType];

    if (adults + minors > maxOccupancy) {
        return {
            isValid: false,
            message: `La cantidad de personas máxima para ${capitalizeFirstLetter(roomType)} es de ${maxOccupancy}.`
        };
    }
    return { isValid: true };
}

export function displayErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

export function clearErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = '';
    errorMessage.style.display = 'none';
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}