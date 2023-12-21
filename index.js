const express = require("express")
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require("cors")
const app = express()
const port = process.env.port || 5000

app.use(cors())
app.use(express.json())
console.log()
const uri = `mongodb+srv://${process.env.DB_SCCTAST}:${process.env.DB_PASS}@cluster0.wjgws1x.mongodb.net/?retryWrites=true&w=majority`;
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

      const userCollection = client.db('SccTastMenagement').collection("users")
      const userAllTast = client.db('SccTastMenagement').collection("allTask")
     

        //   -------------------------------ALL TASK API-----------------------------------
       app.get('/alltask', async(req, res)=>{
        const result = await userAllTast.find().toArray()
        res.send(result)
       })
        app.post('/alltask', async(req, res)=>{
        const result = await userAllTast.insertOne(req.body)
        res.send(result)
       })
        //   -------------------------------USER API-----------------------------------
        app.get('/user', async(req, res)=>{
            const result = await userCollection.find().toArray()
            res.send(result)
        })
     app.post('/user', async(req, res)=>{
        const query = { email: req.body.email };
        const existingUser = await userCollection.findOne(query);
        if (existingUser) {
          return res.send({ message: "user alredy exists", insertedId: null });
        }
        const result = await userCollection.insertOne(req.body)
        res.send(result)
     })

      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  
run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('start the scc task menagement')
})
app.listen(port, ()=>{
    console.log(`start the server port : ${port}`)
})








