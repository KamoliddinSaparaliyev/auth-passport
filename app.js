const express = require('express');

require('dotenv').config();

const connection = require('./config/database');
const errorHandler = require('./handler/errorHandlers');

// Express app setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- PASSPORT AUTHENTICATION --------------
 */
require('./config/passport');

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
