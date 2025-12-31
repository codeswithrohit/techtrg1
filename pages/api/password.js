import connectDb from "../../middleware/mongoose";
import Password from "../../models/Password";

export default async function handler(req, res) {
  await connectDb();

  if (req.method === "POST") {
    // Create a new password if not exists
    const { password } = req.body;
    const existingPassword = await Password.findOne();

    if (existingPassword) {
      return res.status(400).json({ message: "Password already exists" });
    }

    const newPassword = new Password({ password });
    await newPassword.save();
    return res.status(201).json({ message: "Password saved", password: newPassword });
  }

  if (req.method === "GET") {
    // Fetch the password, create default if none exists
    let password = await Password.findOne();

    if (!password) {
      const defaultPassword = new Password({ password: "default123" });
      await defaultPassword.save();
      password = defaultPassword;
    }

    return res.status(200).json(password);
  }

  if (req.method === "PUT") {
    // Update the password
    const { newPassword } = req.body;
    const password = await Password.findOne();

    if (!password) {
      return res.status(404).json({ message: "No password found" });
    }

    password.password = newPassword;
    await password.save();
    return res.status(200).json({ message: "Password updated", password });
  }

  if (req.method === "DELETE") {
    // Delete the password
    await Password.deleteMany({});
    return res.status(200).json({ message: "Password deleted" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
