import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({
  id: "talent-core",
});

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {

    //syncing user to mongodb
    await connectDB();

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImage: image_url,
    };

    await User.create(newUser);

   //syncing users to stream
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });

    //Send a Welcome email ro the user in future
  },
);
  


const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
     //mongo db user deletion when clerk user is deleted
    await connectDB();

    const { id } = event.data;

    await User.deleteOne({ clerkId: id });

    //stream user deletion when clerk user is deleted
    await deleteStreamUser(id.toString());
  }
);

export const functions = [syncUser, deleteUserFromDB];

export default {
  inngest,
  functions,
};