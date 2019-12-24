const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const {buildSchema} = require('graphql')
const mongoose = require("mongoose")
const mongoUtil = require("./lib/mongoutils")

const mongoUrl= "mongodb://localhost:27017/mydb"

app = express()

app.use(bodyParser.json())
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type RootQuery {
            events : [Event!]!
            searchEvents(filter: EventFilterInput): [Event!]!
            searchByEmployee (filter: EmployeeFilterInput): [Event!]!
        }
        type RootMutation {
            updateEvent(_id: ID!, approvalStatus : EventState) : Event
        }

        input EventFilterInput {
            _id: ID
            uuid: String
            description: String
            created_at: String
            amount: Float
            currency: String
            approvalStatus: String
    
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
            created_at: String!
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
            console.log(args["filter"])
            return mongoUtil.queryCustom(args["filter"])
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

