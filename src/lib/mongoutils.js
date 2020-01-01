const mongoose = require("mongoose")
const Event = require('../models/event')


async function queryCustom(findPayload,sortPayload,skip,limit)
{
    const result= await Event.find(findPayload).skip(skip).limit(limit).sort(sortPayload)
    return result
}

async function update(query,payload)
{
    const result= await Event.findOneAndUpdate(query,payload,{new : true})
    return result   
}

exports.queryCustom=queryCustom
exports.update=update