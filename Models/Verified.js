const { model, Schema } = require('mongoose');

let verifiedSchema = new Schema({
    Guild: String,
    Channel: String,
    Msg: String,
    Role: String
});

module.exports = model("Verified", verifiedSchema);