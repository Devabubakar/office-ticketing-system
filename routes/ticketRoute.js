const express = require('express')
const tourController = require('../controllers/ticketController')
const authController = require('./../controllers/authController');

const Router = express.Router()

// Router.use(authController.protect);


Router
.route('/')
.post(tourController.createTicket)
.get(tourController.getAllTickets)

Router
.route('/:id')
.get(tourController.getTicket)
.delete(tourController.deleteTicket)
.patch(tourController.updateTour)

module.exports = Router