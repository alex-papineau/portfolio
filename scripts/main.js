document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const map = L.map('map').setView([20, -30], 2);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // const control = L.Routing.control({
    //     routeWhileDragging: true,
    //     reverseWaypoints: true,
    //     showAlternatives: true,
    //     geocoder: L.Control.Geocoder.nominatim(),
    //     router: L.Routing.osrmv1({
    //         serviceUrl: 'https://router.project-osrm.org/route/v1'
    //     })
    // }).addTo(map);

    L.Control.geocoder({
        defaultMarkGeocode: true
    }).addTo(map);
});
