const express = require('express')
const ticketController = require('../controllers/ticketController')
const authController = require('./../controllers/authController');
const Ticket = require('../models/ticketDb');
const { route } = require('./OfficeRoute');


const Router = express.Router()

Router.use(authController.protect);


Router
.route('/')
.post(ticketController.createTicket)
.get(ticketController.getAllTickets)



Router
.route('/:id')
.get(ticketController.getTicket)
.delete(ticketController.deleteTicket)
.patch(ticketController.updateTicket)
.post(ticketController.newTicket)

// Router.route('/mytickets').get(tourController.getMyTickets)
module.exports = Router