const Tickets = require('../models/ticketDb')
const catchAsync = require('../utils/catchasync')
const AppError = require('../utils/appError')
const Office = require('../models/officeDb')

const Email = require('../utils/email');



exports.createTicket = catchAsync(async(req,res,next)=>{
      
   

    const ticket =  await Tickets.create(req.body)
    
    
  
     
    res.status(201).json({
        status:'success',
        message:'Ticket created Successfully!',
        ticket

       
    })
    

    
    

    const url = `${req.protocol}://${req.get('host')}/api/v1/tickets/${ticket.ticketNo}`;
    
  
   
    
    await new Email(ticket, url).sendWelcome();

    
})

exports.getTicket = catchAsync(async(req,res,next)=>{
    const ticket = await Tickets.findById(req.params.id)

    if(!ticket){
        return next (new AppError('No ticket found with that ID',404))
    }

    res.status(200).json({
        status:'success',
        data:{
            ticket
        }
    })
    
})

exports.getAllTickets = catchAsync(async(req,res,next)=>{
    let tickets = await Tickets.find()

    //authorizes only letters specified to current office
    for(let i =0 ; i <tickets.length;i++){
      if(!tickets[i].route.includes(req.office.name)){
        return res.status(200).json({
          status:'success',
          message:'No new letter has arrived in the office'

        })
      }
    }
   
    
    res.status(200).json({
        status:'success',
        response:(await tickets).length,
        data:{
            tickets
        }
    })

    
    

})

exports.deleteTicket = catchAsync(async(req,res,next)=>{
    const ticket = await Tickets.findByIdAndDelete(req.params.id)

    if(!ticket){
        return next(new AppError('No ticket with that Id',404))
    }

    res.status(204).json({
        status:'success',
        message:'Ticket Deleted Successfully'
    })

    

})
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


exports.newTicket = catchAsync(async(req,res,next)=>{
  const query = req.body
  const ticket = await Tickets.findById(req.params.id)
  

  await ticket.progress.push(query)

  if (!ticket) {
    return next(new AppError('No ticket found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ticket
    }
  
});

  

})