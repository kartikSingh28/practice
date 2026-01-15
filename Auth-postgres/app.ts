export {};

const express = require("express");
const app = express();
const { client, connectDB } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.send("Auth Postgres App Running");
});

//signup
app.post("/signup", async (req: any, res: any) => {
  try {
    const parsedData = signupSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Incorrect data format",
        errors: parsedData.error.errors,
      });
    }

    const { name, email, password } = parsedData.data;

    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      "INSERT INTO auth_users (name,email,password_hash) VALUES ($1, $2 ,$3 )",
      [name, email, hashedPassword]
    );

    res.status(200).json({
      message: "User Registered Successfully",
    });

  } catch (err: any) {
     console.error("Signup error:", err); 
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

//signin
app.post("/signin", async (req: any, res: any) => {
  try {
    const parseData = signinSchema.safeParse(req.body);

    if (!parseData.success) {
      return res.status(400).json({
        message: "Incorrect data format",
        errors: parseData.error.errors,
      });
    }

    const { email, password } = parseData.data;

    await connectDB();

    const userRes = await client.query(
      "SELECT id, name, email, password_hash FROM auth_users WHERE email = $1",
      [email]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;
