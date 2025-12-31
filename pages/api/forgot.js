import Forgot from "../../models/Forgot"
import User from "../../models/User"

export default async function handler(req, res) {
    // Check ifthe user exists in the Database
    //Send an email to the user
    if(req.body.sendMail){
    let token = ``
    let forgot = new Forgot({
        email: req.body.email,
        token: token

    })
    let email = `We have sent you this email in response to your request to reset your password on Dr.Point.com
    
    
    To reset your password , please follow link below:
    
    <a href="http://localhost:3000/forgot?token=${token}">Click here to reset your password</a>
    <br/><br/>

    We recommend that you keep your password secure and not share it with anyone. If you feel your passwordhas been
    compromised, you can change it by going to your My Account Page and change your password.


    <br/><br/>`
}
else{

}
    res.status(200).json({ success:true })
  }
  