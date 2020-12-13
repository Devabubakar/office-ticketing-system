const mongoose = require('mongoose')
const validator = require('validator')


//Custom Unique Friendly Object IDs
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890abcdef', 5)


const Tickets = new mongoose.Schema({
    _id: {
        type: String,
        default: () => nanoid()
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],

    },
    regNO: {
        type: String,
        required: [true, 'Please input a valid registration number']
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        validator: [validator.isEmail, 'Please provide a valid email']
    },
    subject: {
        type: String,
        required: true
    },
    progress: [
        {
            office: {
                type: mongoose.Schema.ObjectId,
                ref: 'Office',
                required: 'A letter must be connected to an office'
            },
            timeIn: Date,
            timeOut: Date,
            status: {
                type: String,
                enum: {
                    values: ['Completed', 'Review'],
                    message:
                        'Status is either Completed or under Review'
                }
            }
        }
    ]

})










module.exports = mongoose.model('Tickets', Tickets)