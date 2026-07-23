import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();

const __dirname=path.resolve();


// middleware
app.use(express.json());




// credentials true means the server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use(clerkMiddleware()); //this will add auth object to the request if the user is authenticated, which we can use in our routes
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);


app.get("/health",(req,res) =>{
    res.status(200).json({msg:"success from api"})
});

if(ENV.NODE_ENV === "development"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
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
