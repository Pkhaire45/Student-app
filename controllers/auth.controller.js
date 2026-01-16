const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Institute = require("../models/Institute");

const generateInstituteCode = () => {
  return `INST-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

exports.registerInstitute = async (req, res) => {
  try {
    const {
      instituteName,
      address,
      adminName,
      adminEmail,
      password
    } = req.body;

    if (!instituteName || !adminName || !adminEmail || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔍 check admin already exists
    const existingAdmin = await Admin.findOne({
      email: adminEmail.toLowerCase()
    });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // 🧠 auto-generate unique institute code
    const instituteCode = generateInstituteCode();

    // 🏫 create institute
    const institute = await Institute.create({
      name: instituteName,
      address,
      code: instituteCode
    });

    // 👤 create admin
    const admin = await Admin.create({
      instituteId: institute._id,
      name: adminName,
      email: adminEmail.toLowerCase(),
      password,
      role: "ADMIN"
    });

    res.status(201).json({
      message: "Institute and Admin created successfully",
      institute: {
        id: institute._id,
        code: institute.code
      },
      adminId: admin._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};


const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.login = async (req, res) => {
  try {
    let { role, username, password, instituteCode } = req.body;

    if (!role || !username || !password) {
      return res.status(400).json({
        message: "Role, username and password required"
      });
    }

    role = role.toUpperCase();
    username = String(username).trim();

    let user;
    let instituteId = null;

    // ================= ADMIN LOGIN =================
    if (role === "ADMIN") {
      user = await Admin.findOne({
        email: username.toLowerCase()
      }).select("+password");

      if (!user) {
        return res.status(400).json({
          message: "Invalid username or password"
        });
      }

      instituteId = user.instituteId;
    }

    // ================= STUDENT LOGIN =================
    else if (role === "STUDENT") {
      if (!instituteCode) {
        return res.status(400).json({
          message: "Institute code required"
        });
      }

      const institute = await Institute.findOne({
        code: instituteCode
      });

      if (!institute) {
        return res.status(404).json({
          message: "Invalid institute code"
        });
      }

      instituteId = institute._id;

      user = await Student.findOne({
        username,
        instituteId
      }).select("+password");

      if (!user) {
        return res.status(400).json({
          message: "Invalid username or password"
        });
      }
    }

    // ================= INVALID ROLE =================
    else {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // ================= PASSWORD CHECK =================
    if (String(user.password).trim() !== String(password).trim()) {
      return res.status(400).json({
        message: "Invalid username or password"
      });
    }

    // ================= TOKEN =================
    const token = generateToken({
      userId: user._id,
      role,
      instituteId
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      role
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Login failed"
    });
  }
};






