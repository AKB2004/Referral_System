const mongoose = require('mongoose');
// const PORT = 2000;
const mongoDBConnectionDB = async () => {

    try 
    {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log(`/mongoDB is connected succesfully on port ${conn.connection.host}`); 
    } catch (error) 
    {
        console.error(`{error.message}`);    
        process.exit(1);
    }
};

module.exports = mongoDBConnectionDB;