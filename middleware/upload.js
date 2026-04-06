import multer from "multer";
import cloudinary from "../config/cloudinary.js";

import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "quickNest",
    format: "webp",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1000, height: 1000, crop: "limit" },
      {
        quality: "auto",
      },
      {
        fetch_format: "auto",
      },
    ],
  },
});

const uploads = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export default uploads;
