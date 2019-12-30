const mongoose = require("mongoose")
const Event = require('../models/event')


async function insertIntoDb(req){
    const expense = new Event(req)
    const result = await expense.save()
    console.log(result)
    return result
}


async function queryCustom(findPayload,sortPayload)
{
    const result= await Event.find(findPayload).sort(sortPayload)
    console.log(findPayload)
    return result
}

async function fetchAll(sortPayload)
{
   
        const result = await Event.find().sort(sortPayload )
        console.log(result)
        return result     
}

async function update(query,payload)
{
    const result= await Event.findOneAndUpdate(query,payload,{new : true})
    return result   
}

exports.insertIntoDb=insertIntoDb
exports.fetchAll=fetchAll
exports.queryCustom=queryCustom
exports.update=update