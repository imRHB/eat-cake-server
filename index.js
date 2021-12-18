const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whfic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        // Eat Cake database
        const database = client.db('eat-cake');

        // Collection
        const cakeCollection = database.collection('cake');

        // const cake = {
        //     name: 'Cream Cake 8',
        //     price: 100
        // };

        // const result = await cakeCollection.insertOne(cake);
        // console.log(result);

        // GET API : Cakes
        app.get('/cake', async (req, res) => {
            const cake = await cakeCollection.find({}).toArray();
            res.json(cake);
        });

        // GET API : Single Cake
        app.get('/cake/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cakeCollection.findOne(query);
            res.json(result);
        });
    }

    finally {
        // client.close();
    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Eat Cake server is runnung');
});

app.listen(port, (req, res) => {
    console.log('Eat Cake server is running at port', port);
});