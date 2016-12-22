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
    },
    review: {
        body: {
            contractAddress: Joi.string().required(),
            accountAddress: Joi.string().required(),
            password: Joi.string().required(),
            review: {
                isModified: Joi.number().required(),
                modifyComment: Joi.string().required(),
                changedFileHash: Joi.string().required()
            }
        }
    },
    revoke: {
        body: {
            contractAddress: Joi.string().required(),
            accountAddress: Joi.string().required(),
            password: Joi.string().required(),
            revoke: {
                comment: Joi.string().required()
            }
        }
    },
    changestate: {
        body: {
            contractAddress: Joi.string().required(),
            accountAddress: Joi.string().required(),
            password: Joi.string().required(),
            method: Joi.string().required()
        }
    },
    userdetail: {
        body: {
            contractAddress: Joi.string().required(),
            adminAddress: Joi.string().required(),
            password: Joi.string().required(),
            accountAddress: Joi.string().required()
        }
    },
    log:{
      body: {
          contractAddress: Joi.string().required(),
          accountAddress: Joi.string().required(),
          password: Joi.string().required()
        }
    }
};
