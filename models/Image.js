// models/Image.js

const mongoose = require('mongoose');

let Image;

try {
  // Check if the model has already been registered
  Image = mongoose.model('Image');
} catch (e) {
  // If the model hasn't been registered, define it
  const Schema = mongoose.Schema;

  const ImageSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  });

  Image = mongoose.model('Image', ImageSchema);
}

export default Image;
