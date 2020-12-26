const Tickets = require('../models/ticketDb');
const catchAsync = require('../utils/catchasync');
const AppError = require('../utils/appError');

const Email = require('../utils/email');

exports.createTicket = catchAsync(async (req, res, next) => {
  // Adding office name to req.body automatically
  // i know I am mutating the req.body object which isnt good DSA practice but it works!! 😁
  const query = req.body;
  query.progress.forEach(elem => {
    elem.office = req.office.name;
  }); // I do not think this is necessary due to the fact the office will be an object.id

  // create the ticket content manually
  const ticket = await Tickets.create(query);

  res.status(201).json({
    status: 'success',
    message: 'Ticket created Successfully!',
    ticket
  });

  // Send Tracking Token to the student
  const url = `${req.protocol}://${req.get('host')}/api/v1/tickets/${
    ticket._id
  }`;
  await new Email(ticket, url).sendWelcome();
});
exports.getTicket = catchAsync(async (req, res, next) => {
  const ticket = await Tickets.findById(req.params.id);

  if (!ticket) {
    return next(new AppError('No ticket found with that ID', 404));
  }

  // Progress of the letter
  const { progress } = ticket;
  res.status(200).json({
    status: 'success',
    progress
  });
});
exports.getAllTickets = catchAsync(async (req, res, next) => {
  const tickets = await Tickets.find();

  // No letter has been created

  if (!tickets) {
    return next(new AppError('No ticket has been created', 404));
  }

  // authorizes only letters specified to current office
  for (let i = 0; i < tickets.length; i++) {
    if (!tickets[i].route.includes(req.office.name)) {
      return res.status(200).json({
        status: 'success',
        message: 'No new letter has arrived in the office'
      });
    }
  }

  res.status(200).json({
    status: 'success',
    response: (await tickets).length,
    data: {
      tickets
    }
  });
});
exports.deleteTicket = catchAsync(async (req, res, next) => {
  const ticket = await Tickets.findByIdAndDelete(req.params.id);

  if (!ticket) {
    return next(new AppError('No ticket with that Id', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Ticket Deleted Successfully'
  });
});
exports.updateTicket = catchAsync(async (req, res, next) => {
  const ticket = await Tickets.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!ticket) {
    return next(new AppError('No ticket found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ticket
    }
  });
});

// This logic 🤔
exports.newTicket = catchAsync(async (req, res, next) => {
  const ticket = await Tickets.findById(req.params.id);

  if (!ticket) {
    return next(new AppError('No ticket with that id', 404));
  }

  // authorizes only letters specified to current office

  if (!ticket.route.includes(req.office.name)) {
    return next(
      new AppError('You are not authorized to access this ticket', 404)
    );
  }

  // check if the office has updated status
  for (let i = 0; i < ticket.progress.length; i++) {
    const elem = ticket.progress[i];
    if (elem.office === req.office.name) {
      return next(
        new AppError('Sorry !You Cant update status of ticket twice', 404)
      );
    }
  }

  // add office name automatically to req.body
  const query = req.body;
  query.office = req.office.name;

  // edits the status of the letters in the progress object
  const letter = await ticket.progress.push(query);
  await ticket.save(letter);

  // If The letter has reached every office and request the user to came for a reply
  if (ticket.progress.length > ticket.route.length) {
    const url = `${req.protocol}://${req.get('host')}/api/v1/tickets/${
      ticket._id
    }`;
    await new Email(ticket, url).Complete();
  }

  res.status(200).json({
    status: 'success',
    data: {
      ticket
    }
  });
});

/*
  Copyright @ Abubakar Ali 
  Dec 2020
 */
