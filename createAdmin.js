require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI);

(async () => {
  const exists = await Admin.findOne({ role: "admin" });

  if (exists) {
    console.log("admin already exists");
    process.exit(1);
  }

  const admin = await Admin.create({
    name: "surendra",
    email: "surendrabairwa852@gmail.com",
    password: "Surendra@123",
    role: "admin"
  });

  console.log("admin created:", admin.email);
  process.exit();
})();
