import { clerkClient } from "@clerk/express";

// middleware to check userid and has premium plan

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();
    const hasPremium = has({ plan: "premium" });

    const user = await clerkClient.users.getUser(userId);

    if (!hasPremium && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      await clerkClient.users.updateUser(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });

      req.free_usage = 0;
    }

    res.plan = hasPremium ? "premium" : "free";
    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
