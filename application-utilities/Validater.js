'use strict';
var Joi = require('joi');
module.exports = {
    createAccount: {
        body: {
            email: Joi.string().email().required(),
            ethPassword: Joi.string().required()
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
            password: Joi.string().required(),
            recipient:Joi.string().required()
        }
    },
    privateRunContract: {
        body: {
            contractAddress: Joi.string().required(),
            accountAddress: Joi.string().required(),
            password: Joi.string().required(),
            memberAddress: Joi.string().required(),
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
