document.addEventListener('DOMContentLoaded', () => {
    // Check if the map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Initialize the map and set its view to a chosen geographical coordinates and a zoom level
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Add an OpenStreetMap tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add a marker to the map
    L.marker([51.505, -0.09]).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
});
