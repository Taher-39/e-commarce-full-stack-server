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
    //post 
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    //read
    app.get("/products", (req, res) => {
        productCollection.find()
            .toArray((err, document) => {
                res.send(document)
            })
    })

});

app.listen(port)