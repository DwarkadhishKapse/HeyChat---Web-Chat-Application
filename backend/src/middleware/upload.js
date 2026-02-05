import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "heychats",
    resource_type: "auto", // Can be image, video, file
  },
});

export const upload = multer({ storage });