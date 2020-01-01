const {buildSchema} = require('graphql')

module.exports = buildSchema(`

scalar DateTime

type RootQuery {
    searchEvents(filter: EventFilterInput, sort:EventSortInput, limit: Int, offset: Int ): [Event!]!
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
    startingDate : DateTime
    endingDate :DateTime
    minAmount: Float
    maxAmount: Float
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
`)