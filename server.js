const app = require('./app')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

//DB connection
const mongoose = require('mongoose')

const DB = process.env.NODE_DB.replace(
    '<password>',
    process.env.NODE_DB_PASS
);

mongoose.connect(DB,{
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log('DB connection successfull')
    console.log(process.env.NODE_ENV)
})



//server initialisation
const PORT = process.env.NODE_PORT || 5000
app.listen(PORT,()=>{
    
    console.log(`App running on port ${PORT}`)
   
})


//Abubakar ALi 2020//