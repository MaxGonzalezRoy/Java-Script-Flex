async function fetchData() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // URL de ejemplo
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    } finally {
        console.log("Petición finalizada");
    }
}