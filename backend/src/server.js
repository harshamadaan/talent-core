import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import User from "./models/User.js";

const app = express();

const __dirname=path.resolve();


// middleware
app.use(express.json());

if (!inngest) {
  throw new Error("Inngest client failed to initialize. Check ./lib/inngest.js exports.");
}

if (!functions) {
  throw new Error("Inngest functions failed to initialize. Check ./lib/inngest.js exports.");
}

// credentials true means the server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

app.post("/api/users", async (req, res) => {
  try {
    const { clerkId, email, name, profileImage } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ error: "clerkId and email are required" });
    }

    const existing = await User.findOne({ clerkId });
    if (existing) {
      return res.status(200).json({ user: existing });
    }

    const user = await User.create({ clerkId, email, name, profileImage });
    return res.status(201).json({ user });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ error: "Unable to save user" });
  }
});

app.get("/health",(req,res) =>{
    res.status(200).json({msg:"success from api"})
});

if (ENV.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
