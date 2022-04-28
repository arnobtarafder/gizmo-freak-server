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
    try {
        await client.connect();
        console.log("database connected");

        const productCollection = client.db("gizmoFreak").collection("product");
        const orderCollection = client.db("gizmoFreak").collection("orders");

        app.post("/login", (req, res) => {
            const email = req.body;

            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
            res.send({ token });
        })

        app.post("/uploadProduct", async (req, res) => {
            const product = req.body;

            const tokenInfo = req.headers.authorization;
            console.log(tokenInfo);
            const [email, accessToken] = tokenInfo?.split(" ");

            const decoded = verifyToken(accessToken)

            if (email === decoded.email) {
                const result = await productCollection.insertOne(product);
                res.send({ sucess: "Product Uploaded Successfully" })
            }
            else {
                res.send({ sucess: "Unauthorized Access" })
            }

        })

        app.get("/products", async(req, res) => {
            const products = await productCollection.find().toArray();
            res.send(products);
        })

        app.post("/addOrder", async(req, res) => {
            const orderInfo = req.body;

            const result = await orderCollection.insertOne(orderInfo);
            res.send({success: "order complete"})
        })
    }
    finally {

    }
}
run().catch(console.dir)




app.get("/", (req, res) => {
    res.send("This is the central page of gizmo freak server");
})

app.listen(port, () => {
    console.log("Listening to the port", port + 2000);
})


// verify token function
function verifyToken(Token) {
    let email;
    jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            email = "Invalid email"
        }
        if (decoded) {
            console.log(decoded);
            email = decoded
        }
    })
    return email;
}