const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


const brands = [
  {
    "id": 1,
    "brandName": "Toyota",
    "brandImage": "https://i.ibb.co/pdd2v1q/toyota.png"
  },
  {
    "id": 2,
    "brandName": "Ford",
    "brandImage": "https://i.ibb.co/1dZxwxR/Ford.jpg"
  },
  {
    "id": 3,
    "brandName": "BMW",
    "brandImage": "https://i.ibb.co/hC6KX9j/BMW.jpg"
  },
  {
    "id": 4,
    "brandName": "Mercedes",
    "brandImage": "https://i.ibb.co/VwyS5vt/Mercedes-Benz.jpg"
  },
  {
    "id": 5,
    "brandName": "Tesla",
    "brandImage": "https://i.ibb.co/GPxqPGR/Tesla.jpg"
  },
  {
    "id": 6,
    "brandName": "Honda",
    "brandImage": "https://i.ibb.co/9hCtpbr/Honda.png"
  }
]

const productsCollection = client.db('vehiVerseDB').collection('products')
const brandCollection = client.db('vehiVerseDB').collection('brand')

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    app.get('/', async (req, res) => {
      // const body = req.body
  
     
      res.send(brands)
    })

    app.get('/brand/:brandName', async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brand: brandName };
      const result = await productsCollection.find(query).toArray()
      res.send(result)

      console.log(result);
    })


    app.get('/products', async (req, res) => {
      const body = req.body
      const result = await productsCollection.find().toArray()
      res.send(result)
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.send(result)
    })


    app.post('/products', async (req, res) => {
      const newProduct = req.body;

      const result = await productsCollection.insertOne(newProduct)
      res.send(result)


    })


    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedProducts = req.body
      const product = {
        $set: {
          image: updatedProducts.image,
          name: updatedProducts.name,
          brand: updatedProducts.brand,
          type: updatedProducts.type,
          price: updatedProducts.price,
          description: updatedProducts.description,
          rating: updatedProducts.rating,
        }
      }
      const result = await productsCollection.updateOne(filter, product, options)
      res.send(result)

    })





    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.deleteOne(query)
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