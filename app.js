const express = require('express');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const session = require('express-session');

require('dotenv').config();

const connection = require('./config/database');
const errorHandler = require('./handler/errorHandlers');
// Create a MongoDB client and connect to the database

// Create the MongoStore with the clientPromise
const sessionStore = MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    collectionName: 'sessions',
});

// Express app setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session configuration
app.use(
    session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            secure: false, // Set to true if using HTTPS
            httpOnly: true,
        },
    })
);

/**
 * -------------- PASSPORT AUTHENTICATION --------------
 */
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', require('./routes'));

// Test route to check session
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend is working' });
});

// Error handling
app.use(errorHandler.notFound);

if (process.env.NODE_ENV === 'development') app.use(errorHandler.developmentErrors);
else app.use(errorHandler.productionErrors);

// Start the server
connection
    .then(() => {
        app.listen(4000, () => {
            console.log('Server is running on port 4000');
        });
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
