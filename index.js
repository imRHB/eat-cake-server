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
        const blogCollection = database.collection('blogs');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('users');


        // GET API : Cakes
        app.get('/cake', async (req, res) => {
            const cake = await cakeCollection.find({}).toArray();
            res.json(cake);
        });

        // POST API : Cake
        app.post('/cake', async (req, res) => {
            const newCake = req.body;
            const result = cakeCollection.insertOne(newCake);
            res.json(result);
        });

        // GET API : Single Cake
        app.get('/cake/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cakeCollection.findOne(query);
            res.json(result);
        });

        // GET API : Blogs
        app.get('/blogs', async (req, res) => {
            const blogs = await blogCollection.find({}).toArray();
            res.json(blogs);
        });

        // GET API : Single Blog
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.json(result);
        });

        // POST API : Blogs


        // DELETE API : Blogs

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

        // GET API : Cake by flavor
        app.get('/flavor/:flavor', async (req, res) => {
            const flavor = req.params.flavor;
            const query = { flavor: flavor };
            const cakeFlavor = cakeCollection.find(query);
            const result = await cakeFlavor.toArray();
            res.json(result);
        });

        // POST API : User
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = userCollection.insertOne(newUser);
            res.json(result);
        });

        // PUT API : User
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // PUT API : Set admin role
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // PUT API : Order status
        /* app.put('/orders', async (req, res) => {
            const order = req.body;
            const filter = { _id: ObjectId(order) };
            const updateStatus = {
                $set: {
                    status: 'Shipped'
                }
            };
            const result = await orderCollection.updateOne(filter, updateStatus);
            res.json(result);
        }); */

        // GET API : Admin role
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // DELETE API : Cake
        app.delete('/cake/:cakeId', async (req, res) => {
            const cakeId = req.params.cakeId;
            const query = { _id: ObjectId(cakeId) };
            const result = await cakeCollection.deleteOne(query);
            res.json(result);
        });

        // DELETE API : Order
        app.delete('/orders/:cakeId', async (req, res) => {
            const cakeId = req.params.cakeId;
            const query = { _id: cakeId };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        // GET API : Single Order
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.findOne(query);
            res.json(result);
        });

        // PUT API : Order Status
        app.put('/orders/:cakeId', async (req, res) => {
            const cakeId = req.params.cakeId;
            const filter = { _id: ObjectId(cakeId) };
            const updateStatus = {
                $set: {
                    status: req.body.status
                }
            };
            const result = await orderCollection.updateOne(filter, updateStatus);
            res.json(result);
        });
    }

    finally {
        // client.close();
    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('<h1>Eat Cake server is running ...</h1>');
});

app.listen(port, (req, res) => {
    console.log('Eat Cake server is running at port', port);
});