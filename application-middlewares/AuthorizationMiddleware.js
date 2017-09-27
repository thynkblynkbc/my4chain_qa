var async = require('async')
module.exports.AuthorizationMiddleware = (function() {
    var verifyIsRoleInAccessLevel = function(next, results, res, req, accessLevel) {
        var roleInAccessLevel = configurationHolder.config.accessLevels[accessLevel]
        var authorized = false
        domain.User.findOne({
            _id: results.authorizationTokenObject.user
        }, function(err, userObject) {
            if (roleInAccessLevel.indexOf(userObject.role) > -1) {
                authorized = true
                req.loggedInUser = userObject
                next(results, authorized)
            } else {
                configurationHolder.ResponseUtil.responseHandler(res, null, configurationHolder.errorMessage.failedAuthorization, true, 401)
            }
        })
    }
    var findRoleByAuthToken = function(next, results, req, res, authToken) {
        console.log(authToken)
        domain.AuthenticationToken.findOne({
            authToken: authToken
        }, function(err, authObj) {
            if (err || authObj == null) {
                configurationHolder.ResponseUtil.responseHandler(res, null, configurationHolder.errorMessage.failedAuthorization, true, 401)
            } else {
                next(null, authObj)
            }
        })
    }
    var authority = function(accessLevel) {
        return function(req, res, next) {
            var authToken = req.get("Authorization")
            if (authToken == null && accessLevel == "anonymous") {
                Logger.info("executed in accesslevel ")
                req.loggedInUser = null
                next()
            } else {
                async.auto({
                    authorizationTokenObject: function(next, results) {
                        return findRoleByAuthToken(next, results, req, res, authToken)
                    },
                    isRoleInAccessLevel: ['authorizationTokenObject', function(next, results) {
                        verifyIsRoleInAccessLevel(next, results, res, req, accessLevel)
                    }]
                }, function(err, results) {
                    if (results.isRoleInAccessLevel == true) {
                        next()
                    } else {
                        configurationHolder.ResponseUtil.responseHandler(res, null, configurationHolder.errorMessage.failedAuthorization, true, 401)
                    }
                })
            }
        }
    }
    return {
        authority: authority
    };
})();
