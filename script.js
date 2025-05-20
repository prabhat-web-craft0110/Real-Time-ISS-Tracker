// Initialize the map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create ISS marker
const issIcon = L.divIcon({
    className: 'iss-icon',
    html: '<div style="background:#0074D9;width:16px;height:16px;border-radius:50%;border:2px solid white"></div>',
    iconSize: [20, 20]
});
let issMarker = L.marker([0, 0], {icon: issIcon}).addTo(map);
let path = L.polyline([], {color: 'blue'}).addTo(map);
const positions = [];

// Function to update ISS position
async function updateISSPosition() {
    try {
        // Fetch data from Open Notify API
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();
        
        // Update the display
        document.getElementById('latitude').textContent = data.latitude.toFixed(4);
        document.getElementById('longitude').textContent = data.longitude.toFixed(4);
        document.getElementById('altitude').textContent = data.altitude.toFixed(2) + ' km';
        document.getElementById('velocity').textContent = Math.round(data.velocity) + ' km/h';
        
        // Update the map marker
        const newPos = [data.latitude, data.longitude];
        issMarker.setLatLng(newPos);
        
        // Update the path
        positions.push(newPos);
        if (positions.length > 50) positions.shift();
        path.setLatLngs(positions);
        
        // Occasionally center the map
        if (positions.length % 10 === 0) {
            map.setView(newPos);
        }
        
    } catch (error) {
        console.error("Error fetching ISS data:", error);
        document.getElementById('latitude').textContent = "Error";
        document.getElementById('longitude').textContent = "Error";
    }
}

// Update every 5 seconds
updateISSPosition();
setInterval(updateISSPosition, 5000);