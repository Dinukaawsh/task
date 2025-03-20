import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const UpdateUserForm = () => {
  const router = useRouter();
  const { id } = router.query; 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
    if (!id) return; // If ID is not yet available, skip the fetch

    const fetchUser = async () => {
      try {
        const response = await axios.get<{ name: string; email: string; phone: string; role: string; profile_image: string }>(`/api/users/${id}`);
        const user = response.data;
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
        setRole(user.role);
        setProfileImage(user.profile_image);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]); // Only run this effect when `id` changes

  const handleImageUpload = async () => {
    if (!newImageFile) return profileImage; // If no new file selected, use existing image

    const formData = new FormData();
    formData.append('file', newImageFile);
    formData.append('upload_preset', 'qvb86kbn');

    const response = await axios.post<{ secure_url: string }>('https://api.cloudinary.com/v1_1/ditrw5sb5/image/upload', formData);
    return response.data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const imageUrl = await handleImageUpload();

      const updatedUser = { name, email, phone, role, profile_image: imageUrl };

      await axios.put(`/api/users/${id}`, updatedUser);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error updating user.');
    }
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
  {error && <div className="alert alert-danger">{error}</div>}

  <div className="mb-3">
    <h1>Update User</h1>
    <label className="form-label">Name</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="form-control"
    />
  </div>

  <div className="mb-3">
    <label className="form-label">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="form-control"
    />
  </div>

  <div className="mb-3">
    <label className="form-label">Phone</label>
    <input
      type="tel"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="form-control"
    />
  </div>

  <div className="mb-3">
    <label className="form-label">Role</label>
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="form-select"
    >
      <option value="manager">Manager</option>
      <option value="admin">Admin</option>
      <option value="salesman">Salesman</option>
    </select>
  </div>

  <div className="mb-3">
    <label className="form-label">Current Image</label>
    <br />
    <img src={profileImage} alt="Current profile" width="150" className="mb-3" />
  </div>

  <div className="mb-3">
    <label className="form-label">Change Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
      className="form-control"
    />
  </div>

  <button type="submit" className="btn btn-primary">Update User</button>
</form>

  );
};

export default UpdateUserForm;
