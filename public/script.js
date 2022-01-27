const getInfo = document.getElementById('get-info');
let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

if('geolocation' in navigator){
    console.log('geolocation is present');
    navigator.geolocation.getCurrentPosition(async (position) => {
        let lat,lon,weather,air;
        getInfo.addEventListener('click',() => {
            map.setView([lat,lon],13);
            L.marker([lat, lon]).addTo(map);      
        })
        try{
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            document.getElementById('latitude').textContent = lat;
            document.getElementById('longitude').textContent = lon;
            const api_url = `/weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const json = await response.json();
            console.log(json);
            weather = json.weather.current;
            air = json.air_quality.results[0].measurements[0];
            document.getElementById('summary').textContent = weather.condition.text;
            document.getElementById('temperature').textContent = weather.temp_f; 
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_value').textContent = air.value;
            document.getElementById('aq_units').textContent = air.unit;
            document.getElementById('aq_date').textContent = air.lastUpdated
        }catch(err){
            console.error(err);
            air = {value: -1};
            document.getElementById('aq_value').textContent = 'NO READING';
        }
        const data = { lat , lon, weather, air };
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }
            const db_response = await fetch('/api',options);
            const db_json = await db_response.json();
            console.log(db_json);
    });
}else{
    console.log('geolocation is not available');
}

