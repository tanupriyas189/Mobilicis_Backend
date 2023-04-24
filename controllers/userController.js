const User = require('../models/users');
const APIFeatures = require('../utils/apiFeatures');
const { sendRes } = require('../utils/resJson');

exports.addData = async (req, res) => {
  try {
    const jsonData = require('../sample_data.json');
    // console.log(jsonData)

    for (var i = 0; i < jsonData.length; i++) {
      var newJson = {
        ...jsonData[i],
        income: parseFloat(jsonData[i].income.toString().substring(1)),
        phone_price: parseInt(jsonData[i].phone_price.toString()),
      };

      // console.log(newJson);

      const data = await User.create(jsonData[i]);
      // console.log('data: ', data);
    }

    sendRes(false, 200, jsonData, 'Success', jsonData.length, res);
  } catch (err) {
    sendRes(true, 500, null, 'Internal Error', 0, res);
  }
};

exports.findAllWithIncomeLessThen5AndBWAndMercedes = async (req, res) => {
  try {
    const features = new APIFeatures(
      User.find({
        $and: [
          { income: { $lte: '$5' } },
          {
            $or: [{ car: { $eq: 'BMW' } }, { car: { $eq: 'Mercedes-Benz' } }],
          },
        ],
      }),
      req.body
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const data = await features.query;
    const totalElements = await User.countDocuments({
      $and: [
        { income: { $lte: '$5' } },
        {
          $or: [{ car: { $eq: 'BMW' } }, { car: { $eq: 'Mercedes-Benz' } }],
        },
      ],
    });
    console.log(totalElements);
    sendRes(
      false,
      200,
      { data: data, pages: Math.ceil(totalElements / req.body.limit) },
      'Success',
      data.length,
      res
    );
  } catch (err) {
    console.log(err);
    sendRes(true, 500, err.toString(), 'Internal Error', 0, res);
  }
};

exports.findAllMaleUsersWithPhonePriceMoreThen10000 = async (req, res) => {
  try {
    const features = new APIFeatures(
      User.find({
        $and: [{ phone_price: { $gte: '10000' } }, { gender: 'Male' }],
      }),
      req.body
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const data = await features.query;
    const totalElements = await User.countDocuments({
      $and: [{ phone_price: { $gte: '10000' } }, { gender: 'Male' }],
    });
    // console.log(data);

    sendRes(
      false,
      200,
      { data: data, pages: Math.ceil(totalElements / req.body.limit) },
      'Success',
      data.length,
      res
    );
  } catch (err) {
    console.log(err);
    sendRes(true, 500, err.toString(), 'Internal Error', 0, res);
  }
};

exports.findAllUsersLastNameWithMQouteLenthGT15EmailIncludesLastName = async (
  req,
  res
) => {
  try {
    const features = new APIFeatures(
      User.find({
        $and: [
          {
            last_name: { $gte: 'm', $lt: 'n' },
            $expr: {
              $gt: [{ $strLenCP: '$quote' }, 15],
            },
            $expr: {
              $ne: [{ $indexOfCP: ['$email', '$lastName'] }, -1],
            },
          },
        ],
      }),
      req.body
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const data = await features.query;
    const totalElements = await User.countDocuments({
      $and: {
        last_name: { $gte: 'm', $lt: 'n' },
        $expr: {
          $gt: [{ $strLenCP: '$quote' }, 15],
        },
        $expr: {
          $ne: [{ $indexOfCP: ['$email', '$lastName'] }, -1],
        },
      },
    });

    // console.log(data);

    sendRes(
      false,
      200,
      { data: data, pages: Math.ceil(totalElements / req.body.limit) },
      'Success',
      data.length,
      res
    );
  } catch (err) {
    console.log(err);
    sendRes(true, 500, err.toString(), 'Internal Error', 0, res);
  }
};

exports.findAllUsersWhoseCarAreBMQMercedesAudiAndEmailDoesntIncludeDigits =
  async (req, res) => {
    try {
      const features = new APIFeatures(
        User.find({
          $and: [
            { carBrand: { $in: ['BMW', 'Mercedes-Benz', 'Audi'] } },
            { email: { $not: { $regex: /\d/ } } },
          ],
        }),
        req.body
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const data = await features.query;
      const totalElements = await User.countDocuments({
        $and: [
          { carBrand: { $in: ['BMW', 'Mercedes-Benz', 'Audi'] } },
          { email: { $not: { $regex: /\d/ } } },
        ],
      });

      // console.log(data);

      sendRes(
        false,
        200,
        { data: data, pages: Math.ceil(totalElements / req.body.limit) },
        'Success',
        data.length,
        res
      );
    } catch (err) {
      console.log(err);
      sendRes(true, 500, err.toString(), 'Internal Error', 0, res);
    }
  };

exports.showTheDataOfTheTop10CitiesWithTheHighestNumberOfUsersAndTheirAverageIncome =
  async (req, res) => {
    try {
      const data = await User.aggregate([
        {
          $group: {
            _id: '$city',
            userCount: { $sum: 1 },
            totalIncome: {
              $sum: { $toDouble: { $substr: ['$income', 1, -1] } },
            },
          },
        },
        { $sort: { userCount: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            city: '$_id',
            userCount: 1,
            avgIncome: { $divide: ['$totalIncome', '$userCount'] },
          },
        },
      ]);

      // console.log(data);

      sendRes(false, 200, data, 'Success', data.length, res);
    } catch (err) {
      console.log(err);
      sendRes(true, 500, err.toString(), 'Internal Error', 0, res);
    }
  };
