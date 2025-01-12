const mongoose = require('mongoose');
const DnsMapping = require('./model/dnsMap'); // Ensure the model path is correct

// MongoDB connection string
const mongoUri = 'mongodb://127.0.0.1:27017/ko'; // Replace 'ko' with your database name

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        // Check if domain mappings already exist
        const existingMappings = await DnsMapping.countDocuments();

        if (existingMappings === 0) {
            // Insert the initial mappings for the two sites
            await DnsMapping.insertMany([
                {
                    domain: 'virtron.meta',
                    filePath: 'https://vince489.github.io/Vault220', // Use plain strings for URLs
                },
                {
                    domain: 'example.huh',
                    filePath: 'https://example.com/', // Use plain strings for URLs
                },
            ]);
            console.log('Inserted initial DNS mappings');
        } else {
            console.log('DNS mappings already exist');
        }

        mongoose.disconnect(); // Disconnect after operation
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit if the connection fails
    });
