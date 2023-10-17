const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.qiowubl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      await client.connect();


      const productsCollection = client.db('vehiVerseDB').collection('products')

      app.get('/products', async (req, res) => {
          const brand = req.body
          console.log(brand);
        //   const query = { brand: brand }
          const result = await productsCollection.find().toArray()
          res.send(result)
      })

      app.post('/products', async (req, res) => {
          const products = req.body;
          console.log(products);
          const result = await productsCollection.insertOne(products)
          console.log(result);
          res.send(result)
      })
      









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('VehiVerse server side is running')
})

app.listen(port, () => {
    console.log(`VehiVerse server is running on port ${port}`);
})