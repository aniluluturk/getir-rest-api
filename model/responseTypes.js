//generic response types for success and fail
responseTypes = {
    "success" : {
        code: 0,
        msg: "success",
    },
    "fail" :  {
        code: 1,
        msg: undefined,
    }
};

Object.freeze(responseTypes);

module.exports = responseTypes;