// Import model
Record = require('../model/recordModel');
ResponseTypes = require('../model/responseTypes');

// return result by start/end date filter and minCount/maxCount filter
exports.routes = function (req, res) {
    Record.get(req.body, function (err, records) {
        if (err) {
            //return error result
            res.status(404).json({
                code: ResponseTypes.fail.code,
                msg: "Failed to fetch records",
            });
        } else {
            //return success result
            res.status(200).json({
                code: ResponseTypes.success.code,
                msg: ResponseTypes.success.msg,
                records: records
            });
        }
    });
};

//return by id
exports.view = function (req, res) {
    Record.findById(req.params.id, function (err, record) {
        if (err) {
            //return error result
            res.status(404).json({
                code: ResponseTypes.fail.code,
                msg: ResponseTypes.fail,
                message: "Failed to fetch the record",
            });
        } else {
            //return success result
            res.status(200).json({
                code: ResponseTypes.success.code,
                msg: ResponseTypes.success.msg,
                record: record
            });
        }
    });
};
