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
    "brandName": "toyota",
    "brandImage": "https://i.ibb.co/QQDrtJN/toyota0.png"
  },
  {
    "id": 2,
    "brandName": "ford",
    "brandImage": "https://i.ibb.co/z7BbxS8/ford0.png"
  },
  {
    "id": 3,
    "brandName": "bmw",
    "brandImage": "https://i.ibb.co/kKm4yhF/bmw0.png"
  },
  {
    "id": 4,
    "brandName": "mercedes",
    "brandImage": "https://i.ibb.co/92QzBFz/mercedes0.png"
  },
  {
    "id": 5,
    "brandName": "tesla",
    "brandImage": "https://i.ibb.co/wWKpJbH/tesla0.png"
  },
  {
    "id": 6,
    "brandName": "honda",
    "brandImage": "https://i.ibb.co/DKdRgwh/honda0.png"
  }
]

const productsCollection = client.db('vehiVerseDB').collection('products')
const brandCollection = client.db('vehiVerseDB').collection('brand')
const cartCollection = client.db('vehiVerseDB').collection('cart')

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

    // app.post('')


    app.post('/products', async (req, res) => {
      const newProduct = req.body;


      const doc = {
        brand: newProduct.brand,
        id: newProduct.brand.id
      }

     const newProductBrand = await brandCollection.insertOne(doc)

      console.log(newProductBrand);



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

    app.post('/mycart', async (req, res) => {
      const cartProduct = req.body;
      console.log(cartProduct);
      const result = await cartCollection.insertOne(cartProduct)
      res.send(result)
    })
    app.get('/mycart', async (req, res) => {
      const result = await cartCollection.find().toArray()
      res.send(result)
    })


    app.post('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cartCollection.insertOne(query)
      res.send(result)
    })

    app.delete('/mycart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cartCollection.deleteOne(query)
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