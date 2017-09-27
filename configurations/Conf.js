//add Roles in the system
var roles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN', 'ROLE_DELEGATEADMIN']
// Add different accessLevels
var accessLevels = {
    'anonymous': ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN', 'ROLE_DELEGATEADMIN'],
    'user': ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN'],
    'admin': ['ROLE_ADMIN', 'ROLE_SUPERADMIN'],
    'superadmin': ['ROLE_SUPERADMIN'],
    'delegate': ['ROLE_SUPERADMIN', 'ROLE_DELEGATEADMIN', 'ROLE_ADMIN']
}
var configVariables = function() {
    switch (process.env.NODE_ENV) {
        case 'development':
            var config = {
                port: 3000,
                host: 'http://localhost:3000/',
                verificationUrl: 'http://localhost:3000/verify/',
                emailFrom: 'deepchand.prajapati@oodlestechnologies.com',
                emailPassword: '*********',
                blockchainIp: 'http://127.0.0.1:8001',
                blockchainPort: '8001'
            }
            config.roles = roles
            config.accessLevels = accessLevels
            return config;
        case 'qa':
            var config = {
                port: 3002,
                host: 'http://localhost:3002/',
                verificationUrl: 'http://localhost:3002/verify/',
                emailFrom: 'deepchand.prajapati@oodlestechnologies.com',
                emailPassword: '*********',
                blockchainIp: 'http://127.0.0.1:8002',
                blockchainPort: '8002'
            }
            config.roles = roles
            config.accessLevels = accessLevels
            return config;
        case 'local':
            var config = {
                port: 3000,
                host: 'http://localhost:3000/',
                verificationUrl: 'http://localhost:3000/verify/',
                emailFrom: 'deepchand.prajapati@oodlestechnologies.com',
                emailPassword: '*********',
                blockchainIp: 'http://127.0.0.1:8001',
                blockchainPort: '8001'
            }
            config.roles = roles
            config.accessLevels = accessLevels
            return config;
        case 'staging':
            var config = {
                port: 3000,
                host: 'http://localhost:3000/',
                verificationUrl: 'http://localhost:3000/verify/',
                emailFrom: 'deepchand.prajapati@oodlestechnologies.com',
                emailPassword: '*********',
                blockchainIp: 'http://127.0.0.1:8001',
                blockchainPort: '8000'
            }
            config.roles = roles
            config.accessLevels = accessLevels
            return config;
        case 'production':
            var config = {
                port: 3000,
                host: 'http://localhost:3000/',
                verificationUrl: 'http://localhost:3000/verify/',
                emailFrom: 'deepchand.prajapati@oodlestechnologies.com',
                emailPassword: '*********',
                blockchainIp: 'http://127.0.0.1:8001',
                blockchainPort: '8001'
            }
            config.roles = roles
            config.accessLevels = accessLevels
            return config;
        case 'test':
            var config = {
                port: 3001,
                host: 'http://localhost:3001/',
                verificationUrl: 'http://localhost:3001/verify/',
                emailFrom: 'deepchand.prajapati@oodlestechnologies.com',
                emailPassword: '*********',
                blockchainIp: 'http://10.0.0.4:8545',
                blockchainPort: '8545'
            }
            config.roles = roles
            config.accessLevels = accessLevels
            return config;
    }
}
module.exports.configVariables = configVariables;
