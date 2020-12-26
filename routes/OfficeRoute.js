const express = require('express');
const OfficeController = require('../controllers/OfficeController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// // // Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updatepassword', authController.updatePassword);
router.patch('/updateMe', OfficeController.updateMe);
router.get('/me', OfficeController.getMe, OfficeController.getOffice);

// Admin//
/*
  Restricted Zone
*/
router.use(authController.restrictTo('admin'));

router.post('/create', authController.createOffice);
router.delete('/deleteMe', OfficeController.deleteMe);
router.get('/alloffice', OfficeController.getAllOffices);

router
  .route('/:id')
  .get(OfficeController.getOffice)
  .patch(OfficeController.updateOffice)
  .delete(OfficeController.deleteOffice);

module.exports = router;

/*
  Copyright @ Abubakar Ali 
  Dec 2020
 */
