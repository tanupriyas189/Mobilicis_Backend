const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.get('/add', userController.addData);
router.post(
  '/findAllWithIncomeLessThen5AndBWAndMercedes',
  userController.findAllWithIncomeLessThen5AndBWAndMercedes
);
router.post(
  '/findAllMaleUsersWithPhonePriceMoreThen10000',
  userController.findAllMaleUsersWithPhonePriceMoreThen10000
);
router.post(
  '/findAllUsersLastNameWithMQouteLenthGT15EmailIncludesLastName',
  userController.findAllUsersLastNameWithMQouteLenthGT15EmailIncludesLastName
);
router.post(
  '/findAllUsersWhoseCarAreBMQMercedesAudiAndEmailDoesntIncludeDigits',
  userController.findAllUsersWhoseCarAreBMQMercedesAudiAndEmailDoesntIncludeDigits
);
router.post(
  '/showTheDataOfTheTop10CitiesWithTheHighestNumberOfUsersAndTheirAverageIncome',
  userController.showTheDataOfTheTop10CitiesWithTheHighestNumberOfUsersAndTheirAverageIncome
);

module.exports = router;
