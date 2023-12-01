const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const useragent = require('express-useragent');
const errorMiddleware = require('../middlewares/errors');
const appRoutes = require('../loaders/routes');
const ErrorHandler = require('../utils/errorHandler');


exports.init = ({ app }) => {

     
    // Setup body parser
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static('../public'));

    // Setup security headers
    app.use(helmet());

    // Setup body parser
    app.use(express.json());

    // Set cookie parser
    app.use(cookieParser());

    // Handle file uploads
    app.use(fileUpload());

    

    // Prevent XSS attacks
    app.use(xssClean());

    // Express user agent
    app.use(useragent.express());

    // Prevent Parameter Pollution
    app.use(hpp({
        whitelist: ['positions']
    }));

    // Setup CORS - Accessible by other domains
    app.use(cors());

    // Setup app routes
    appRoutes.routes({ app: app });

    // Handle unhandled routes
    app.all('*', (req, res, next) => {

        res.sendFile("index.html", { root: __dirname + "/../../../public" });
        // next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
    });

    // Middleware to handle errors
    app.use(errorMiddleware);

}
