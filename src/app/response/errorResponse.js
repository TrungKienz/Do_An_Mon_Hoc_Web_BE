// Define a function to generate a conflict error response
const conflict = (conflictName) => {
    return {
        success: false,
        message: `${conflictName} already exists`,
        data: null,
        errorCode: 409,
    };
};

// Define a function to generate a failed operation error response
const failedResponse = (action) => {
    return {
        success: false,
        message: `Failed to ${action}`,
        data: null,
        errorCode: 500,
    };
};

// Define a function to generate a data incorrect error response
const dataIncorrect = (nameIncorrect) => {
    return {
        success: false,
        message: `${nameIncorrect} incorrect`,
        data: null,
        errorCode: 404,
    };
};

// Define a function to generate a data invalid error response
const dataInvalid = (nameInvalid) => {
    return {
        success: false,
        message: `${nameInvalid} invalid`,
        data: null,
        errorCode: 401,
    };
};

// Define a function to generate a custom error response
const otherErrorResponse = (message, errorCode) => {
    return {
        success: false,
        message: `${message}`,
        data: null,
        errorCode: errorCode,
    };
};

// Export all the defined functions as an object
module.exports = {
    conflict,
    failedResponse,
    dataIncorrect,
    dataInvalid,
    otherErrorResponse,
};
