const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icikx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Running Genius server')
});


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('trying to connect ');

        const database = client.db('carMechanic');
        const serviceCollation = database.collection('services');
        // get all api 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollation.find({});
            const services = await cursor.toArray();
            res.send(services);

        })
        // get single  service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollation.findOne(query);
            res.send(service)

        })

        // post 
        app.post('/service', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await serviceCollation.insertOne(service);

            console.log('hitting data', service);
            res.json(service)
        })
        //  delete
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = serviceCollation.deleteOne(query);
            console.log(result);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log('Running Genius SErver on port', port);
})
