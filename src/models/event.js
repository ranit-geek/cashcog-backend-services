const mongoose = require("mongoose")
const Schema = mongoose.Schema

const eventSchema = new Schema({
    uuid : String,
    description : String,
    created_at : String,
    amount: Number,
    currency: String,
    employee: {
        uuid: String,
        first_name: String,
        last_name: String
    },
    approvalStatus: {
        type: String,
        enum : ['Pending','Approved','Declined'],
        default: 'Pending'
    }
})

module.exports =mongoose.model('Expenses', eventSchema)