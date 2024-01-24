const successfulResponse = (action, data) => {
    return {
        success: true,
        message: `${action} successfully`,
        data: data,
        errorCode: 200,
    };
};

const otherSuccessResponse = (message, data, errorCode) => {
    return {
        success: true,
        message: `${message}`,
        data: data,
        errorCode: errorCode,
    };
};

module.exports = { successfulResponse, otherSuccessResponse };
