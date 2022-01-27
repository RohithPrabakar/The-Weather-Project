let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch('/api')
.then((res) => {
    return res.json();
})
.then((data) => {
    console.log(data);
    for(item of data){
        const marker = L.marker([item.lat, item.lon]).addTo(map);
        let txt = `The weather here at ${item.lat}, ${item.lon} is ${item.weather.condition.text} with a temperature of ${item.weather.temp_f}&deg;F.`;
        if(item.air.value < 0){
            txt += ' No air quality reading.'
        }else{
            txt += ` The concentration of particulate matter (${item.air.parameter}) is 
            ${item.air.value} ${item.air.unit} last read on ${item.air.lastUpdated}.`
        }
        
        marker.bindPopup(txt);

        // const root = document.createElement('p');
        // const geo = document.createElement('div');
        // const dateString = new Date(item.timestamp).toLocaleString();
        // const date = document.createElement('div');
        // geo.textContent = `${item.lat}, ${item.lon}`;
        // date.textContent = dateString;
        
    
        // root.append(geo,date);
        // document.body.append(root);
    }
})