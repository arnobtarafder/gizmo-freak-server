const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken")
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json())


/** 
 * client site collect email => send to backend
 * abc@abstract.com  sl,aSA/sAS/.\<div className="asF">a;fasfm</div>
 * asjbhafkasml\]'l'\asmanaw0m'\[aas,mf]  <======= decode
 */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n63qw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        await client.connect();
        console.log("database connected");

        const productCollection = client.db("gizmoFreak").collection("product");

        app.post("/login", (req, res) => {
            const email = req.body;

            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
            res.send({token});
        })

        app.post("/uploadProduct", async(req, res) => {
          const product = req.body;
          const result = await productCollection.insertOne(product);
          res.send({success: "Product Uploaded Successfully"})
        })
    }
    finally{

    }
}
run().catch(console.dir)




app.get("/", (req, res) => {
    res.send("This is the central page of gizmo freak server");
})

app.listen(port, () => {
    console.log("Listening to the port", port + 2000);
})