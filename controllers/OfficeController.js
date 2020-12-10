const Office = require('./../models/officeDb');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


exports.getMe = (req, res, next) => {
  req.params.id = req.Office.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if Office POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 3) Update Office document
  const updatedOffice = await Office.findByIdAndUpdate(req.Office.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      Office: updatedOffice
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Office.findByIdAndUpdate(req.Office.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createOffice = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getOffice = factory.getOne(Office);
exports.getAllOffices = factory.getAll(Office);

// Do NOT update passwords with this!
exports.updateOffice = factory.updateOne(Office);
exports.deleteOffice = factory.deleteOne(Office);