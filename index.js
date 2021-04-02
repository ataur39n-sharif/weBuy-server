const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const ObjectId = require('mongodb').ObjectId


const app = express()
const port = process.env.PORT || 5000
app.use(cors());
app.use(bodyParser.json());

// console.log(process.env.DB_NAME, process.env.DB_PASS, process.env.DB_USER);

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hhwqe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productList = client.db("weBuy").collection("products");
    const orderList = client.db("weBuy").collection("orders");
    console.log('db connected');

    app.post('/addProduct', (req, res) => {
        const productData = req.body;
        // console.log(productData);
        productList.insertOne(productData)
            .then(result => {
                console.log(result);
            })
    })

    app.get('/products' , (req, res) => {
        productList.find({})
        .toArray((error, document) => {
            res.send(document)
        })
    })

    app.get('/products/:id' , (req, res) => {
        // const product = req.params.id
        productList.find({_id: ObjectId(req.params.id)})
        .toArray((error, document) => {
            res.send(document)
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body
        console.log(order);
        orderList.insertOne(order)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/orders' , (req, res) => {
        orderList.find({email:req.query.email})
        .toArray((error , result) =>{
          res.send(result)  
        })
    })

    app.get('/orders/:id', (req, res) => {
        orderList.find({_id: ObjectId(req.params.id)})
        .toArray((error, result) =>{
            res.send(result)
        })
    })
    
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);

        productList.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            console.log(result);
            res.send(result.deletedCount > 0)
        })
    })



});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)