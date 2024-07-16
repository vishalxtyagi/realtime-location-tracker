const socket = io();

const map = L.map('map').setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markers = {};
let initialViewSet = false;
let isMapCentered = true;

// Add a control button for centering the map
L.Control.CenterMap = L.Control.extend({
    onAdd: function(map) {
        const btn = L.DomUtil.create('button', 'center-map-btn');
        btn.innerHTML = 'Center Map';
        btn.onclick = function() {
            updateMapView(true);
            isMapCentered = true;
        };
        return btn;
    }
});
new L.Control.CenterMap({ position: 'topright' }).addTo(map);

socket.on('receiveLocation', (data) => {
    const { id, latitude, longitude, deviceInfo } = data;
    
    const popupContent = `
        <strong>Device Info:</strong><br>
        Platform: ${deviceInfo.platform}<br>
        Browser: ${deviceInfo.userAgent.split(') ')[0].split(' (')[1]}<br>
        Screen: ${deviceInfo.screenResolution}<br>
        Last updated: ${new Date().toLocaleTimeString()}
    `;

    const isNewDevice = !markers[id];

    if (isNewDevice) {
        markers[id] = L.marker([latitude, longitude])
            .bindPopup(popupContent)
            .addTo(map);
    } else {
        markers[id].setLatLng([latitude, longitude])
            .bindPopup(popupContent);
    }

    if (!initialViewSet || (isNewDevice && isMapCentered)) {
        updateMapView(true);
        initialViewSet = true;
        isMapCentered = true;
    }
});

socket.on('userDisconnect', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

function updateMapView(forceUpdate = false) {
    if (Object.keys(markers).length === 0) return;

    const bounds = L.latLngBounds(Object.values(markers).map(marker => marker.getLatLng()));
    
    if (forceUpdate || !map.getBounds().contains(bounds)) {
        map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 0.5 });
    }
}

// Track map movement
map.on('movestart', () => {
    isMapCentered = false;
});

// Function to get and send device info
function getDeviceInfo() {
    const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        screenColorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
        batteryLevel: null,
        deviceMemory: navigator.deviceMemory || 'unknown',
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    };

    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            deviceInfo.batteryLevel = battery.level;
            sendDeviceInfo(deviceInfo);
        });
    } else {
        sendDeviceInfo(deviceInfo);
    }
}

function sendDeviceInfo(deviceInfo) {
    socket.emit('deviceInfo', deviceInfo);
}

// Send device info when connecting
socket.on('connect', getDeviceInfo);

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('sendLocation', { latitude, longitude });
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}