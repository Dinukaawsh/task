import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

// API handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();  // Ensure to connect to the database

  switch (req.method) {
    case "GET":
      const { id } = req.query;
      if (id) {
        try {
          const user = await User.findById(id);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          return res.status(200).json(user);
        } catch (error) {
          return res.status(500).json({ message: "Error fetching user", error });
        }
      } else {
        try {
          const users = await User.find({});
          return res.status(200).json(users);
        } catch (error) {
          return res.status(500).json({ message: "Error fetching users", error });
        }
      }
      break;

    case "POST":
      const { name, age, profile_image, phone, email, role, managedBy } = req.body;

      if (!name || !age || !profile_image || !phone || !email || !role) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      try {
        const user = new User({
          name,
          age,
          profile_image,
          phone,
          email,
          role,
          managedBy,
        });
        await user.save();
        return res.status(201).json(user);
      } catch (error) {
        return res.status(500).json({ message: "Error creating user", error });
      }
      break;

    case "PUT":
      const { id: updateId } = req.query;
      const { name: updateName, age: updateAge, profile_image: updateProfileImage, phone: updatePhone, email: updateEmail, role: updateRole, managedBy: updateManagedBy } = req.body;

      if (!updateId || !updateName || !updateAge || !updateProfileImage || !updatePhone || !updateEmail || !updateRole) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          updateId,
          { name: updateName, age: updateAge, profile_image: updateProfileImage, phone: updatePhone, email: updateEmail, role: updateRole, managedBy: updateManagedBy },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(updatedUser);
      } catch (error) {
        return res.status(500).json({ message: "Error updating user", error });
      }
      break;

    case "DELETE":
      const { id: deleteId } = req.query;
      if (!deleteId) {
        return res.status(400).json({ message: "Missing user ID" });
      }
      try {
        const deletedUser = await User.findByIdAndDelete(deleteId);
        if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        return res.status(500).json({ message: "Error deleting user", error });
      }
      break;

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
