const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const item = require('./models');

const searchByName = (req, res, next) => {
    const urlParameter = req.params.name;
    // Find the objet by name
    item.find({'name' : urlParameter}, (err, item) => {
        if (err) {
            return handleError(err);
        } else {
            res.json(item);
        }
    });
};

module.exports = { searchByName }