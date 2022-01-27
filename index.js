const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`listening to ${port}`);
})

const database = new Datastore('database.db');
database.loadDatabase();

app.use(express.static('public'));
app.use(express.json());

app.post('/api', (req,res) => {
    console.log('I got a request');
    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    res.json({
        data,
        status:'success'
    })
})

app.get('/api', (req,res) => [
    database.find({}, (err,data) => {
        if(err) {
            res.end()
            return;
        }
        res.json(data)
    })
])

app.get('/all',(req,res) => {
    res.sendFile('./public/logs/index.html',{root: __dirname});
})

app.get('/weather/:latlon',async (req,res) => {
    const latlon = req.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    }

    res.json(data);
})

