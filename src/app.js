const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const {buildSchema} = require('graphql')
const mongoose = require("mongoose")
const mongoUtil = require("./lib/mongoutils")


const mongoUrl= "mongodb://localhost:27017/mydb"

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
    schema: buildSchema(`

        scalar DateTime

        type RootQuery {
            events : [Event!]!
            searchEvents(filter: EventFilterInput, sort:EventSortInput ): [Event!]!
            searchByEmployee (filter: EmployeeFilterInput): [Event!]!
        }
        type RootMutation {
            updateEvent(_id: ID!, approvalStatus : EventState) : Event
        }

        input EventSortInput {
            field : String
            order : Int
        }

        input EventFilterInput {
            _id: ID
            uuid: String
            description: String
            created_at:  DateTime
            minAmount: Float
            maxAmount: Float
            amount : Float
            currency: String
            approvalStatus: [String]
    
        }

        input EmployeeFilterInput {
            uuid: String
            first_name: String
            last_name: String
        }
        enum EventState {
            Pending 
            Approved
            Declined
        }

        type Event {
            _id: ID!
            uuid: String!
            description: String!
            created_at: DateTime!
            amount: Float!
            currency: String!
            employee: Employee!
            approvalStatus: String!
        }

        type Employee{
            uuid: String!
            first_name: String!
            last_name: String!
        }

        schema {
            query : RootQuery
            mutation : RootMutation
        }
    `),
    rootValue:{
        events: async ()=>{
            return mongoUtil.fetchAll()
        },
        updateEvent: async (args)=>{
            
            return mongoUtil.update({_id : args._id}, {approvalStatus : args.approvalStatus})
        },
        searchEvents: async (args)=>{  
            if ("minAmount" && "maxAmount" in args["filter"])
            {
                args.filter.amount = { $gte :  args.filter.minAmount,$lte :  args.filter.maxAmount}
                args.filter.minAmount = undefined
                args.filter.maxAmount = undefined
            } 
            Object.keys(args["filter"] ).forEach((key) => (args["filter"] [key] == null) && delete args["filter"] [key]);
            var sortQuery = {}
            sortQuery[args.sort.field] = args.sort.order
            
            return mongoUtil.queryCustom(args["filter"] , sortQuery)
        },
        searchByEmployee: async(args)=>{
            
            var query = {
                "employee.first_name" : args.filter.first_name,
                "employee.last_name" : args.filter.last_name
            }
            Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : '');
            console.log(query)
            return mongoUtil.queryCustom(query)
        }

    },
    graphiql : true,
    EventState: {
        Pending :"Pending",
          
        Approved:"Approved",
          
        Declined:"Declined",
          
    }
}))


mongoose.connect(mongoUrl,{ useNewUrlParser: true })
        .then(()=>{
            console.log("connection succesfull")
            app.listen(4000)
        })
        .catch((err)=>console.log(`Error while connecting to mongo ${err}`))

