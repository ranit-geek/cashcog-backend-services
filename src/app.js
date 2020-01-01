const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require("mongoose")
const schema = require('./graphql/schema/index')
const resolvers = require('./graphql/resolvers/index')

const mongoUrl= process.env.MONGO_URL

app = express()
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200)
    }
    next()

})
app.use(bodyParser.json())
app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue:resolvers,
    graphiql : true,
    EventState: {
        Pending :"Pending",
          
        Approved:"Approved",
          
        Declined:"Declined",
          
    }
}))


mongoose.connect(mongoUrl,{ useNewUrlParser: true })
        .then(()=>{
            console.info("Connection succesfull, application is up and running")
            app.listen(process.env.PORT || 4000)
        })
        .catch((err)=>console.error(`Error while connecting to mongo :${err}`))
