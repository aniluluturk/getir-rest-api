//generic response types for success and fail
responseTypes = {
    "success" : {
        code: 0,
        msg: "success",
    },
    "fail" :  {
        code: 1,
        msg: undefined,
    },
    "failByConnectionError": {
        code: 2,
        msg: "mongodb connection lost",
    }
};

Object.freeze(responseTypes);

module.exports = responseTypes;