const mongoUtil = require("../../lib/mongoutils")

module.exports = {
    updateEvent: async (args)=>{
        console.info(`Updating status to ${args.approvalStatus} for user ${args._id}`)
        return mongoUtil.update({_id : args._id}, {approvalStatus : args.approvalStatus})
    },
    searchEvents: async (args)=>{  
        Object.keys(args["filter"] ).forEach((key) => (args["filter"] [key] == null || args["filter"] [key]=="null") && delete args["filter"] [key])
        if ("minAmount" && "maxAmount" in args["filter"])
        {
            args.filter.amount = { $gte :  args.filter.minAmount,$lte :  args.filter.maxAmount}
            delete args.filter.minAmount 
            delete args.filter.maxAmount 
        } 
        if("startingDate" && "endingDate" in args["filter"])
        {
            args.filter.created_at = { $gte :  args.filter.startingDate,$lte :  args.filter.endingDate}
            delete args.filter.startingDate 
            delete args.filter.endingDate 
        }
        var sortQuery = {}
        sortQuery[args.sort.field] = args.sort.order
        console.log("searching")
        return mongoUtil.queryCustom(args["filter"] , sortQuery, args["offset"], args["limit"])
    },
    searchByEmployee: async(args)=>{
        console.info(`Searching for ${args.filter.first_name} ${args.filter.last_name}`)
        var query = {
            "employee.first_name" : args.filter.first_name,
            "employee.last_name" : args.filter.last_name
        }
        Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : '')
        return mongoUtil.queryCustom(query)
    }

}