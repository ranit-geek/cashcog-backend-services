const mongoose = require("mongoose")
const Event = require('../models/event')


async function insertIntoDb(req){
    const expense = new Event(req)
    const result = await expense.save()
    console.log(result)
    return result
}


async function queryCustom(payload)
{
    const result= await Event.find(payload)
    return result
    
}


async function fetchAll()
{
        const result = await Event.find()
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