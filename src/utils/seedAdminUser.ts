import User from "@/models/User";  

const seedAdminUser = async () => {
  const adminExists = await User.findOne({ role: "admin" });

  if (!adminExists) {
    const admin = await User.create({
      name: "Default Admin",
      age: 30,
      profile_image: "https://via.placeholder.com/150", // Placeholder image, can be change later, if update admin
      phone: "000-000-0000",
      email: "admin@example.com",
      role: "admin",
    });
    console.log("Admin user created! Admin ID:", admin._id.toString());
  } else {
    console.log("Admin already exists.");
  }
};

export default seedAdminUser;
