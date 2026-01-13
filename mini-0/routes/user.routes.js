UserRouter.post("/signin", async (req, res) => {
  const Data = z.object({
    email: z.string().email(),
    password: z.string().min(5)
  });

  const parsedData = Data.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Incorrect data format"
    });
  }

  const { email, password } = parsedData.data;

  try {

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    
    const checkedPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!checkedPassword) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    
    return res.json({
      message: "Signin successful",
      token
    });

  } catch (e) {
    return res.status(500).json({
      message: "Error occurred",
      error: e.message
    });
  }
});
