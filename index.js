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
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders');

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

        // GET API : Reviews
        app.get('/reviews', async (req, res) => {
            const reviews = await reviewCollection.find({}).toArray();
            res.json(reviews);
        });

        // POST API : Cake Order
        app.post('/orders', async (req, res) => {
            const orderedCake = req.body;
            const result = await orderCollection.insertOne(orderedCake);
            res.json(result);
        });

        // GET API : All Order
        app.get('/orders', async (req, res) => {
            const orders = await orderCollection.find({}).toArray();
            res.json(orders);
        });

        // POST API : Add Review
        app.post('/add-review', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.json(result);
        });

        // GET API : Order filter by email
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const userOrder = orderCollection.find(query);
            const result = await userOrder.toArray();
            res.json(result);
        });

        // DELETE API : Order
        app.delete('/orders/:cakeId', async (req, res) => {
            const cakeId = req.params.cakeId;
            const query = { _id: cakeId };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        // PUT API : Order Status
        app.put('/orders/:cakeId', async (req, res) => {
            const filter = { status: 'Pending' };
            const updateStatus = {
                $set: {
                    status: 'Delivered'
                }
            };
            const result = await orderCollection.updateOne(filter, updateStatus);
            console.log(result);
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