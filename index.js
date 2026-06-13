const express = require("express");
const env = require("dotenv").config();
const cors = require('cors');
const { MongoClient, ServerApiVersion , ObjectId } = require("mongodb");

const uri = process.env.GONGODB_URL;
console.log(uri);
const app = express();
const port = process.env.PORT;
app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("sportnest");
    const facilityCollection = db.collection("facilities");
    const bookingCollection = db.collection("bookings")

    app.get('/facility', async(req , res)=>{
      const result = await facilityCollection.find().toArray();
      res.json(result);
    });
    app.post("/facility", async (req, res) => {
      const facilityData = req.body;
      const result = await facilityCollection.insertOne(facilityData)
      res.json(result)
    });

    app.get('/facility/:id', async ( req,res) =>{
      const{id} = req.params
      const result = await facilityCollection.findOne({_id: new ObjectId(id)})
      res.json(result)
    });

    app.patch('/facility/:id', async(req, res) =>{
      const{id} = req.params
      const updatedData = req.body
      const result = await facilityCollection.updateOne(
        {_id:new ObjectId(id)},
        {$set:updatedData}

      )
      res.json(result)
    });

    app.delete('/facility/:id', async(req, res) =>{
       const{id} = req.params;
       const result = await facilityCollection.deleteOne({_id: new ObjectId(id)})
       res.json(result);
    });
      app.get('/booking/:userId', async (req, res) =>{
        const {userId} =req.params;
        const result = await bookingCollection.find({userId:userId}) .toArray();
res.json(result)
      });

    app.post("/booking", async(req, res) =>{
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.json(result);

    });

  

    app.get("/FeaturedFacilities ", async (req, res) => {
  const result = await facilityCollection.find().limit(6).toArray();
  res.json(result);
});

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
