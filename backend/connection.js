const mongoose = require("mongoose")

async function connectMongoose(url)
{
    return await mongoose.connect(url)
}

module.exports = connectMongoose