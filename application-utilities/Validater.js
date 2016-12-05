'use strict';
var Joi = require('joi');
module.exports = {
    createAccount: {
        body: {
            email: Joi.string().email().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
            ethPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
        }
    },
    privateSendether: {
        body: {
            fromAddress: Joi.string().required(),
            password: Joi.string().required(),
            toAddress: Joi.string().required(),
            amount: Joi.number().required()
        }

    },
    privateCreateContract: {
        body: {
            owner: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    privateRunContract: {
        body: {
            contractAddress: Joi.string().required(),
            adminAddress: Joi.string().required(),
            password: Joi.string().required(),
            accountAddress: Joi.string().required(),
            action: Joi.string().required(),
            method: Joi.string().required(),
        }
    }
};
