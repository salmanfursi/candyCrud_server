const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.8k16j71.mongodb.net/?retryWrites=true&w=majority`;
  
  console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const chocolateColection = client.db("chocolateDB").collection("chocolate");

    app.post("/addchocolate", async (req, res) => {
      const newChocolate = req.body;
      const result = await chocolateColection.insertOne(newChocolate);
      res.send(result);
    });

    app.get("/chocolate", async (req, res) => {
      const cursor = chocolateColection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/chocolate/:id", async (req, res) => {
      const id = req.params.id; // Use req.params.id to get the ID from the route
      const query = { _id: new ObjectId(id) };
      const result = await chocolateColection.findOne(query);
      res.send(result);
    });

    app.delete("/chocolate/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateColection.deleteOne(query);
      res.send(result);
    });

    app.put("/chocolate/:id", async (req, res) => {
      const id = req.params.id;
      const choco = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateChoco = {
        $set: {
          name: choco.name,
          country: choco.country,
          category: choco.category,
          photo: choco.photo,
        },
      };
      
      const result = await chocolateColection.updateOne(filter, updateChoco, options);
      res.send(result);
      console.log(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.send("amar sonar bangladesh");
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
