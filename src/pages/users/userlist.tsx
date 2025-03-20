import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  _id: string;
  name: string;
  age: number;
  email: string;
  role: string;
  profile_image?: string; // profile_image is optional
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]); // Type users state with the User interface
  const router = useRouter(); // Use router to navigate

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data: User[] = await res.json(); // Type the response data as an array of User objects
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  // Handle user delete
  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });
        // Remove the user from the state after deletion
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Handle user update (redirect to update page)
  const handleUpdate = (userId: string) => {
    router.push(`/users/update/${userId}`);
  };
  return (
    <div className="container mt-5">
      <h1>User List</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleUpdate(user._id)} className="btn btn-warning me-2">
                  Update
                </button>
                <button onClick={() => handleDelete(user._id)} className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;