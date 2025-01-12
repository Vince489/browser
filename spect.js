const mongoose = require('mongoose');
const DnsMapping = require('./model/dnsMap'); // Ensure the model path is correct

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/ko'; // Use 127.0.0.1 instead of localhost for better compatibility

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(async () => {
        console.log("Connected to MongoDB");

        try {
            // Query the database for the domain
            const result = await DnsMapping.findOne({ domain: "example.huh" });
            if (result) {
                console.log("Found Domain:", result);
            } else {
                console.log("Domain not found in database.");
            }
        } catch (error) {
            console.error("Error querying database:", error);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error("MongoDB connection error:", err));
