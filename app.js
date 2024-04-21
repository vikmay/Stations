const express = require('express');
const cors = require('cors');
const app = express();
const host = 'localhost';
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

let stations = [
    {
        id: 1,
        address: "690 Collins Avenue. Worthington",
        status: true
    },
    {
        id: 2,
        address: "1234 Elm Street. Springfield",
        status: false
    },
    {
        id: 3,
        address: "777 Pine Avenue. Lakeside",
        status: true
    },
    {
        id: 4,
        address: "456 Oak Lane. Riverdale",
        status: false
    },
    {
        id: 5,
        address: "1010 Maple Road. Hillcrest",
        status: true
    },
    {
        id: 6,
        address: "2345 Cedar Court. Brookside",
        status: false
    },
    {
        id: 7,
        address: "891 Birch Street. Lakeview",
        status: true
    },
    {
        id: 8,
        address: "333 Pine Avenue. Sunset Hills",
        status: false
    },
    {
        id: 9,
        address: "678 Walnut Drive. Green Valley",
        status: true
    },
    {
        id: 10,
        address: "444 Ash Street. Riverside",
        status: false
    }
];

// Routes
app.get('/stations', (req, res) => {
    res.send(stations);
});

app.get('/stations/:id', (req, res) => {
    const station = stations.find(st => st.id == req.params.id);
    res.send(station);
});

app.post('/stations', (req, res) => {
    const station = req.body;
    const stationId = stations[stations.length - 1]
        ? stations[stations.length - 1].id + 1 : 1;
    const newStation = { ...station, id: stationId };
    stations.push(newStation);
    res.send(newStation);
});

app.delete('/stations/:id', (req, res) => {
    stations = stations.filter(st => st.id != req.params.id);
    res.send("Station " + req.params.id + " is deleted");
})

app.put('/stations/:id', (req, res) => {
    const index = stations.findIndex(st => st.id == req.params.id);
    stations[index] = {
        ...stations[index],
        ...req.body
    };
    res.send(stations[index]);
})

// Start the server
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
