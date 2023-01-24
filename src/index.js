import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
const app = express();

app.use(cors());
app.use(express.json());
const api_key = "b9qdbakaxxxp";
const api_secret =
  "njbqm598zjxfrgy3g2pjxhvdnzcns3r23bms8hfdkntdtb73jrgcm4k8r7bgssjp";
const serverClient = StreamChat.getInstance(api_key, api_secret);

app.get("/",(req,res)=>{
  res.send("hello");
})

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, userName,email, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);
    res.json({ 
      token, 
      userId, 
      firstName, 
      lastName, 
      userName,
      email, 
      hashedPassword,
      mess:[{}]});
  } catch (error) {
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { users } = await serverClient.queryUsers({ email:email });
    if (users.length === 0) return res.json({ message: "User not found" });

    const token = serverClient.createToken(users[0].id);
    const passwordMatch = await bcrypt.compare(
      password,
      users[0].hashedPassword
    );
      console.log(users);
    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        userName:users[0].userName,
        email,
        userId: users[0].id,
        mess:users[0].mess
      });
    }
  } catch (error) {
    res.json(error);
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running on port 3001");
});
