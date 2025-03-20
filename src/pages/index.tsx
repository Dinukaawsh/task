import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // Import useRouter for navigation
import 'bootstrap/dist/css/bootstrap.min.css';
const UserForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null); 
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("manager");
  const [managedBy, setManagedBy] = useState("");
  
  const router = useRouter(); // Initialize the router

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // If there's a profile image, upload it to Cloudinary
    let imageUrl = "";
    if (profileImage) {
      const formData = new FormData();
      formData.append("file", profileImage);
      formData.append("upload_preset", "qvb86kbn");

      try {
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/ditrw5sb5/image/upload", // Cloudinary API URL
          formData
        );
        const data = cloudinaryResponse.data as { secure_url: string }; // Define the expected type
        imageUrl = data.secure_url; // Get the URL of the uploaded image
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    const newUser = {
      name,
      age,
      profile_image: imageUrl, // Use the uploaded image URL here
      phone,
      email,
      role,
      managedBy,
    };

    try {
      const response = await axios.post("/api/users", newUser);
      console.log(response.data); // Handle success (show message, reset form, etc.)
    } catch (error) {
      console.error("Error creating user:", (error as any).response ? (error as any).response.data : (error as any).message);
    }
  };

  // Navigate to the "View All Users" page when clicked
  const handleViewUsers = () => {
    router.push('/users/userlist'); // Updated path
  };

  return (
    <div className="container mt-5">
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Age:</label>
          <input
            type="number"
            className="form-control"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Profile Image:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone:</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role:</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
            <option value="salesman">Salesman</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Managed By (Admin ID):</label>
          <input
            type="text"
            className="form-control"
            value={managedBy}
            onChange={(e) => setManagedBy(e.target.value)}
            placeholder="Admin User ID"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Create User</button>
      </form>

      <button onClick={handleViewUsers} className="btn btn-secondary mt-3">View All Users</button>
    </div>
  );
};

export default UserForm;