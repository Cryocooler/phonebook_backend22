const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose
  .connect(url)
  .then((res) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{2}-|\d{3}-\d*/.test(v);
      },
    },
    message: (props) => `${props.value} is not a valid number!`,
    required: true,
    minlength: 8,
  },
});

personSchema.plugin(validator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
