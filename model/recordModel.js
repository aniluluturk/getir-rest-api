//import dependencies
var mongoose = require('mongoose');
var _ = require('lodash');

// Setup schema
var recordSchema = mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    counts: Array,
    phone: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export model
var Record = module.exports = mongoose.model('records', recordSchema);

module.exports.get = function (params, callback, limit) {
    try {
        var minCount = parseInt(params.minCount);
        var maxCount = parseInt(params.maxCount);

        /* construct aggregate query params from POST request params - start */

        //fetch count params
        var countParams = {};
        if (!_.isNaN(minCount)) {
            countParams["$gte"] = minCount;
        } else {
            countParams["$gte"] = Number.MIN_SAFE_INTEGER;
        }
        if (!_.isNaN(maxCount)) {
            countParams["$lte"] = maxCount;
        } else {
            countParams["$lte"] = Number.MAX_SAFE_INTEGER;
        }

        //fetch date params
        var dateParams = {};
        var startDate = params.startDate;
        var endDate = params.endDate;
        if (!_.isUndefined(startDate)) {
            dateParams["$gte"] = new Date(startDate);
        }

        if (!_.isUndefined(endDate)) {
            dateParams["$lte"] = new Date(endDate);
        }

        if (_.isUndefined(limit) || limit < 0) {
            limit = Number.MAX_SAFE_INTEGER;
        }

        //gathering countParams and dateParams together in matchParams
        // (to be used in aggregate query's $match key
        var matchParams = {};
        if(!_.isEmpty(countParams )) {
            matchParams['totalCount'] = countParams;
        }
        if(!_.isEmpty(dateParams )) {
            matchParams['createdAt'] = dateParams;
        }

        /* construct aggregate query params from POST request params - end */

        //limit the records by field limit, gather total sum, and filter by matchparams
        Record.aggregate(
            [
                {"$limit": limit},
                {
                    "$addFields": {
                        "totalCount": {
                            "$reduce": {
                                "input": "$counts",
                                "initialValue": 0,
                                "in": {"$add": ["$$value", "$$this"]}
                            }
                        }
                    }
                },
                {
                    "$match": matchParams
                }
            ]
        ).exec((err, data) => {
            //pass error up to callback
            if (err) {
                callback(err, null);
            } else {
                //success
                callback(null, data);
            }
        });
    } catch (e) {
        callback(e, null);
    }
};