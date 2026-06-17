const express = require("express");
const env = require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

const uri = process.env.GONGODB_URL;
console.log(uri);
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(new URL("api/auth/jwks"));
const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  try {
    const { payload } = await jwtVerify(token, JWKS);
  
    next();
  } catch (error) {
    return res.status(401).json({ message: "Forbidden" });
  }
};

async function run() {
  try {
    // await client.connect();

    const db = client.db("sportnest");
    const facilityCollection = db.collection("facilities");
    const bookingCollection = db.collection("bookings");

    app.get("/facility", async (req, res) => {
      const result = await facilityCollection.find().toArray();
      res.json(result);
    });
    app.post("/facility", async (req, res) => {
      const facilityData = req.body;
      const result = await facilityCollection.insertOne(facilityData);
      res.json(result);
    });
    // middleware
    app.get("/facility/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const result = await facilityCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.patch("/facility/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await facilityCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );
      res.json(result);
    });
    app.delete("/booking/:userId", async (req, res) => {
      const { userId } = req.params;

      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(userId),
      });

      res.json(result);
    });

    app.delete("/facility/:id", async (req, res) => {
      const { id } = req.params;
      const result = await facilityCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });
    app.get("/booking/:userId", async (req, res) => {
      const { userId } = req.params;
      const result = await bookingCollection.find({ userId: userId }).toArray();
      res.json(result);
      console.log(result);
    });

    app.get("/facility/:userEmail", async (req, res) => {
      const { userEmail } = req.params;
      const result = await facilityCollection
        .find({ added_By: userEmail })
        .toArray();
      res.json(result);
    });

    app.post("/booking",verifyToken, async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.json(result);
    });

    app.delete("/booking/:bookingId",verifyToken, async (req, res) => {
      const { bookingId } = req.params;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(bookingId),
      });
      res.json(result);
    });

    app.get("/facility", async (req, res) => {
      const search = req.query.search || "";
      const sport = req.query.sport || "";
      console.log(search);
      const query = {};

      if (search) {
        query.facilityName = {
          $regex: search,
          $options: "i",
        };
      }
      console.log(search);

      if (sport) {
        query.facilityType = {
          $in: [sport],
        };
      }

      const result = await facilityCollection.find(query).toArray();
      res.send(result);
      console.log(result);
    });

    app.get("/FeaturedFacilities", async (req, res) => {
      const result = await facilityCollection.find().limit(6).toArray();
      res.json(result);
    });

    // await client.db("admin").command({ ping: 1 });
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
