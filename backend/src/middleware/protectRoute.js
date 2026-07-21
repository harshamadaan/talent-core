//we will use this middleware to protect routes that require authentication. It will check if the user is authenticated using Clerk and then find the corresponding user in our database. If the user is found, it will attach the user object to the request and allow access to the route. If not, it will return an unauthorized error.

import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) {
        return res.status(401).json({ msg: "Unauthorized- invalid token" });
      }

      //find user in db by clerk id
      const user = await User.findOne({ clerkId });

      if (!user) {
        return res.status(401).json({ msg: "Unauthorized" });
      }
      req.user = user; //attach user to request
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware: ", error);
      res.status(500).json({ msg: "Server error" });
    }
  },
];
