const mongoose = require('mongoose');

// Define the schema
const dnsMapSchema = new mongoose.Schema({
    domain: { type: String, required: true, unique: true },
    filePath: { type: String, required: true },
});

// Create the model
const DnsMap = mongoose.model('DnsMap', dnsMapSchema);

module.exports = DnsMap;
