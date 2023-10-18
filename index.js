const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()


// middleware
app.use(cors());
app.use(express.json());


 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldqphqx.mongodb.net/?retryWrites=true&w=majority`;

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

    const brandCollection = client.db('brandDB').collection('products')
    const cartCollection = client.db('brandDB').collection('cartProducts')


    // see all products
    app.get('/products', async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    // find products with brand
    app.get('/products/:brand', async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const cursor = brandCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);

    })

    // find product with id
    app.get('/products/:brand/:id', async (req, res) => {
      const brand = req.params.brand;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query)
      res.send(result);
    })

    // add a new product to database
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await brandCollection.insertOne(newProduct);
      res.send(result)
    })


    // update a product to database
    app.put('/products/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const updatedDoc = {
        $set: {
          name: updateProduct.name,
          price: updateProduct.price,
          brand: updateProduct.brand,
          type: updateProduct.type,
          image: updateProduct.image,
          ratings: updateProduct.ratings,
          description: updateProduct.description,
         }
      }
      const result = await brandCollection.updateOne(filter, updatedDoc, options)
      res.send(result)

    })

     // add product in cart to database
     app.post('/cart', async (req, res) => {
      const cartProduct = req.body;
      console.log(cartProduct);
      const result = await cartCollection.insertOne(cartProduct);
      res.send(result);
     })
    
    // get products of cart from database
    app.get('/cart/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = {email: email} 
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
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









// BASIC for home and port
app.get('/', (req, res) => {
    res.send('Brand shop server is running')

})

app.listen(port, () => {
    console.log(`Coffee server is running on port: ${port}`);
})