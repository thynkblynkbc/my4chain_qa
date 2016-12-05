//add Roles in the system
var roles = ['ROLE_USER', 'ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_DELEGATEADMIN']

// Add different accessLevels
var accessLevels = {
    'anonymous': ['ROLE_USER','ROLE_ADMIN','ROLE_SUPERADMIN','ROLE_DELEGATEADMIN'],
    'user': ['ROLE_USER','ROLE_ADMIN','ROLE_SUPERADMIN'],
    'admin': ['ROLE_ADMIN','ROLE_SUPERADMIN'],
    'superadmin':['ROLE_SUPERADMIN'],
    'delegate':['ROLE_SUPERADMIN','ROLE_DELEGATEADMIN','ROLE_ADMIN']

}


var configVariables = function () {
    switch (process.env.NODE_ENV) {
    case 'development':
        var config = {
            port:3001,
            host: 'http://localhost:3001/',
            verificationUrl:'http://localhost:3001/verify/',
            emailFrom:'himanshu.sharma@oodlestechnologies.com',
            emailPassword:'*********',
        }
        config.roles = roles
        config.accessLevels = accessLevels
        return config;


    case 'staging':
        var config = {
            port:80,
            host: 'http://localhost:3000/',
            verificationUrl:'http://localhost:3000/verify/',
            emailFrom:'himanshu.sharma@oodlestechnologies.com',
            emailPassword:'*********',
        }
        config.roles = roles
        config.accessLevels = accessLevels
        return config;

    case 'production':
       var config = {
            port:80,
            host: 'http://localhost:3000/',
            verificationUrl:'http://localhost:3000/verify/',
            emailFrom:'himanshu.sharma@oodlestechnologies.com',
            emailPassword:'*********',

        }

        config.roles = roles
        config.accessLevels = accessLevels
        return config;

    case 'test':
    var config = {
        port:3001,
        host: 'http://localhost:3001/',
        verificationUrl:'http://localhost:3001/verify/',
        emailFrom:'himanshu.sharma@oodlestechnologies.com',
        emailPassword:'*********',
    }

        config.roles = roles
        config.accessLevels = accessLevels
        return config;


    }
}


module.exports.configVariables = configVariables;
