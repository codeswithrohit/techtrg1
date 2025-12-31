
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: {type: String, required: true},
    courses: {type: Object, required: true},
    

}, {timestamps: true} );

mongoose.models = {}
export default mongoose.model("Courses", OrderSchema);
//export default mongoose.model.Appointment || mongoose.model("Appointment", AppointmentSchema);
