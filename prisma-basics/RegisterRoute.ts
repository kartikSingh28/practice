import express, { Request, Response } from "express";
import { signin, signup } from "./AuthPrisma";
import { signupSchema, signinSchema } from "./schemas/auth-schema";

const app = express();
app.use(express.json());


app.get("/", (req:Request, res: Response) => {
  res.send("Server is running");
});


// signup
app.post("/signup", async (req: Request, res: Response) => {
  const parsedData = signupSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Something Off",
      error: parsedData.error,
    });
  }

  try {
    const result = await signup(parsedData.data);
    res.json({
      message: "User Registered Successfully",
      result,
    });
  } catch (e: any) {
    res.status(400).json({
      error: e.message,
    });
  }
});

// signin
app.post("/signin", async (req: Request, res: Response) => {
  const parsedData = signinSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Something Off",
      error: parsedData.error,
    });
  }

  try {
    const result = await signin(parsedData.data);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({
      error: e.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
