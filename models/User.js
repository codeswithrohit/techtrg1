
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, default:''},
    selectedCourse: {type: String, default:''},
  
   
}, {timestamps: true} );

mongoose.models = {}
export default mongoose.model("39User", UserSchema);
//export default mongoose.model.User || mongoose.model("User", UserSchema);9