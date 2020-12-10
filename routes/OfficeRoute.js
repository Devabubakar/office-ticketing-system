const express = require('express');
const OfficeController = require('./../controllers/OfficeController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// // // Protect all routes after this middleware
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post('/signup', authController.signup);
router.patch('/updatepassword', authController.updatePassword);
router.get('/me', OfficeController.getMe, OfficeController.getOffice);
router.patch(
  '/updateMe',
  OfficeController.updateMe
);
router.delete('/deleteMe', OfficeController.deleteMe);
router
  .route('/')
  .get(OfficeController.getAllOffices)
  .post(OfficeController.createOffice);

router
  .route('/:id')
  .get(OfficeController.getOffice)
  .patch(OfficeController.updateOffice)
  .delete(OfficeController.deleteOffice);

module.exports = router;