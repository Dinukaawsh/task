import { NextApiRequest, NextApiResponse } from 'next'; // Import types
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

// Define the types for the response data
interface ResponseData {
  message?: string;
  error?: any;
  user?: typeof User; // This will be the user object
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching user", error });
      }

    case "PUT":
      try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(updatedUser);
      } catch (error) {
        return res.status(500).json({ message: "Error updating user", error });
      }

    case "DELETE":
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        return res.status(500).json({ message: "Error deleting user", error });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
