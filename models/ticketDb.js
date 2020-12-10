const mongoose = require('mongoose')
const validator = require('validator')


//Custom Unique Friendly Object IDs
const { customAlphabet } = require( 'nanoid')
const nanoid = customAlphabet('1234567890abcdef', 10)




const Tickets = new mongoose.Schema({
        _id: {
            type: String,
            default: () => nanoid()
          },
        name:{
            type:String,
            required:[true,'Please provide a name'],

        },
        regNO:{
            type:String,
            required:[true,'Please input a valid registration number']
        },
        email:{
            type:String,
            lowercase:true,
            required:true,
            validator:[validator.isEmail,'Please provide a valid email']
        },
        subject:{
            type:String,
            required:true
        }
    
})










module.exports = mongoose.model('Tickets',Tickets)