import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log("Register request body:", req.body);
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  try {
    const [data] = await db.query(q, [req.body.email, req.body.username]);
    if (data.length) return res.status(409).json("User already exists.");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    console.log("Inserting user:", req.body.username, req.body.email);
    const q2 = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    await db.query(q2, [values]);

    return res.status(200).json("User has been created.");
  } catch (err) {
    console.error("Error en register:", err);
    return res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  try {
    const [data] = await db.query(q, [req.body.username]);
    if (data.length === 0) return res.status(404).json("User not found.");

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      data[0].password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong username or password.");
    }

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_KEY || "jwtkey");
    const { password, ...other } = data[0];

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json(other);
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json(err);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
