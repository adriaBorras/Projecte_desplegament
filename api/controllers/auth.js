import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// export const register = (req, res) => {
//   //check existing user
//   const q = "SELECT * FROM users WHERE email = ? or username = ?";

//   db.query(q, [req.body.email, req.body.username], (err, data) => {
//     if (err) return res.js(err);
//     if (data.length) return res.status(409).json("User already exists!!");

//     //Hash the password and creta a user
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(req.body.password, salt);
//     // Store hash in your password DB.

//     const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
//     const values = [req.body.username, req.body.email, hash];

//     db.query(q, [values], (err, data) => {
//       if (err) return res.json(err);
//       return res.status(200).json("User has been created");
//     });
//   });
// };

export const register = (req, res) => {
  // Debug: see incoming request data
  console.log("Register request body:", req.body);
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!!");

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);


        // Debug: show what we are inserting
    console.log("Inserting user:", req.body.username, req.body.email);
    const q2 = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(q2, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("User not found!!!🧐");

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res
        .status(400)
        .json(
          "Wrong username or password!!😣 Nome de usuário ou senha incorretos"
        );

    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out🤩.");
};
