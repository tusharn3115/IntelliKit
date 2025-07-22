import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const AI = new OpenAI({
  apiKey: process.env.GEMEINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Generate an article
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = res.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message:
          "You have exhausted your free usage limit. Please upgrade to premium to continue using this feature.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log("Error generating article:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Generate a blog title
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = res.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message:
          "You have exhausted your free usage limit. Please upgrade to premium to continue using this feature.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log("Error generating article:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Generate an image
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = res.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "You need a premium plan to generate images. Please upgrade to premium to continue using this feature.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${
      publish ?? false
    })`;

    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.log("Error generating article:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// remove image background
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = res.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "You need a premium plan to generate images. Please upgrade to premium to continue using this feature.",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${"Remove background from image"}, ${secure_url}, 'image')`;

    res.json({
      success: true,
      content: secure_url,
    });
  } catch (error) {
    console.log("Error generating article:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// remove image object
export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = res.plan;

    // 🔒 Check for premium access
    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "You need a premium plan to generate images. Please upgrade to premium to continue using this feature.",
      });
    }

    // ✅ Validate required fields
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image file is missing.",
      });
    }

    if (!object || object.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Object description is missing.",
      });
    }

    // ✅ Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image.path);

    const public_id = uploadResult.public_id;

    // ✅ Cloudinary gen_remove transformation requires correct syntax — no colon inside the string
    const image_url = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object.trim()}`, // ✅ remove space after colon
        },
      ],
      resource_type: "image",
    });

    // ✅ Log in DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${image_url}, 'image')
    `;

    res.json({
      success: true,
      content: image_url,
    });
  } catch (error) {
    console.error("Error in removeImageObject:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while removing the object",
    });
  }
};


// review resume
export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = res.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "You need a premium plan to generate images. Please upgrade to premium to continue using this feature.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds the 5MB limit.",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Please review the following resume and provide feedback on its strengths and areas for improvement:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${"Review the uploaded resume"}, ${content}, 'resume-review')`;

    res.json({
      success: true,
      content,
    });

  } catch (error) {
    console.log("Error generating article:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
