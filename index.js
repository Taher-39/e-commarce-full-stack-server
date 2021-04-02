const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT || 5000
require("dotenv").config()

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const { connect } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvvgh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productCollection = client.db("HatBazar").collection("product");
    const checkoutCollection = client.db("HatBazar").collection("checkout");
    //post 
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    //post for checkout
    app.post('/productCheckout', (req, res) => {
        const newCheckout = req.body;
        checkoutCollection.insertOne(newCheckout)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })
    //read
    app.get("/products", (req, res) => {
        productCollection.find()
            .toArray((err, document) => {
                res.send(document)
            })
    })
    //read by id
    app.get('/product/:id', (req, res) =>{
        productCollection.find({ _id: ObjectId(req.params.id)})
        .toArray((err, document) => {
            res.send(document[0])
        })
    })
    //read by email
    app.get('/orders', (req, res) => {
        checkoutCollection.find({email: req.query.email})
        .toArray((err, document) => {
            res.send(document)
        })
    })
    //delete item 
    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0)
            })
    })
});

app.listen(port)