
const express = require("express");
const env = require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

const uri = process.env.GONGODB_URL;

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

const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

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
    const db = client.db("sportnest");
    const facilityCollection = db.collection("facilities");
    const bookingCollection = db.collection("bookings");

    app.get("/facility", async (req, res) => {
      console.log("GET /facility endpoint targeted with query parameters:", req.query);
      const search = req.query.search || "";
      const sport = req.query.sport || "";
      const query = {};

      if (search) {
        query.facilityName = {
          $regex: search,
          $options: "i",
        };
      }

      if (sport) {
        query.facilityType = {
          $in: [sport],
        };
      }

      const result = await facilityCollection.find(query).toArray();
      res.json(result);
    });

    app.get("/FeaturedFacilities", async (req, res) => {
      console.log("GET /FeaturedFacilities endpoint targeted");
      const result = await facilityCollection.find().limit(6).toArray();
      res.json(result);
    });

    app.get("/facility/user/:userEmail", async (req, res) => {
      console.log("GET /facility/user/:userEmail targeted for email:", req.params.userEmail);
      const { userEmail } = req.params;
      const result = await facilityCollection
        .find({ added_By: userEmail })
        .toArray();
      res.json(result);
    });

    app.get("/facility/:id" , verifyToken ,async (req, res) => {
      console.log("GET /facility/:id targeted for ID:", req.params.id);
      try {
        const { id } = req.params;
        const result = await facilityCollection.findOne({
          _id: new ObjectId(id),
        });
        res.json(result);
      } catch (error) {
        console.log("Error inside GET /facility/:id conversion:", error.message);
        res.status(400).json({ message: "Invalid structure id format" });
      }
    });

    app.post("/facility",  async (req, res) => {
      console.log("POST /facility endpoint targeted");
      const facilityData = req.body;
      const result = await facilityCollection.insertOne(facilityData);
      res.json(result);
    });

    app.patch("/facility/:id", async (req, res) => {
      console.log("PATCH /facility/:id targeted for ID:", req.params.id);
      try {
        const { id } = req.params;
        const updatedData = req.body;
        const result = await facilityCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData },
        );
        res.json(result);
      } catch (error) {
        console.log("Error inside PATCH /facility/:id conversion:", error.message);
        res.status(400).json({ message: "Invalid structure id format" });
      }
    });

    app.delete("/facility/:id", async (req, res) => {
      console.log("DELETE /facility/:id targeted for ID:", req.params.id);
      try {
        const { id } = req.params;
        const result = await facilityCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.json(result);
      } catch (error) {
        console.log("Error inside DELETE /facility/:id conversion:", error.message);
        res.status(400).json({ message: "Invalid structure id format" });
      }
    });

    app.get("/booking/:userId", async (req, res) => {
      console.log("GET /booking/:userId targeted for user ID:", req.params.userId);
      const { userId } = req.params;
      const result = await bookingCollection.find({ userId: userId }).toArray();
      res.json(result);
    });

    app.post("/booking", async (req, res) => {
      console.log("POST /booking endpoint targeted");
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.json(result);
    });

    app.delete("/booking/:bookingId", async (req, res) => {
      console.log("DELETE /booking/:bookingId targeted for ID:", req.params.bookingId);
      try {
        const { bookingId } = req.params;
        const result = await bookingCollection.deleteOne({
          _id: new ObjectId(bookingId),
        });
        res.json(result);
      } catch (error) {
        console.log("Error inside DELETE /booking/:bookingId conversion:", error.message);
        res.status(400).json({ message: "Invalid structure id format" });
      }
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});