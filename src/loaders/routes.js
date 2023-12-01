const login = require('../routes/login')
const report = require('../routes/polarbird')

exports.routes = ({ app }) => {
    // Importing all routes   
    app.use('/api/v1', login)
    app.use('/api/v1', report)
}



