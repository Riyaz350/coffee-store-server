const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// coffeeAddict
// lCelDHL81dcABVti


// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.gx7mkcg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const dbConnect = async () => {
  try {
      await client.connect();
      console.log("Database Connected successfully ✅");
  } catch (error) {
      console.log(error.name, error.message);
  }
}
dbConnect();

 
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("user");

    app.get('/', async(req, res)=>{
      console.log('server is running ')
  })

    app.get('/coffee', async(req, res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray()
      res.send(result)

    })

    app.get('/coffee/:id', async(req, res)=>{
      const id = req.params.id
      const item = {_id : new ObjectId(id)}
      const result = await coffeeCollection.findOne(item)
      res.send(result)
    })

    app.post('/coffee', async(req, res)=>{
      const newCoffee = req.body
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    app.put('/coffee/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedCoffee = req.body
      const coffee = {
        $set:{
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          supplier: updatedCoffee.supplier,
          chef: updatedCoffee.chef,
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(query, coffee, options)
      res.send(result)

    })

    app.delete('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })


    // USER SERVER INFO

    app.get('/users', async(req, res)=>{
      const users = userCollection.find()
      const result = await users.toArray()
      res.send(result)
    })

    app.post('/users', async(req, res)=>{
      const user = req.body
      const result = await userCollection.insertOne(user)
      res.send(result )
    })


    // Send a ping to confirm a successful connection
   





app.listen(port, ()=>{
    console.log(`your server is running on port ${port}`)
})