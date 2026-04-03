import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";


const storage = new CloudinaryStorage = ({
    cloudinary,
    params:{
        folder:"quickNest",
        format:"webp",
        allowed_formats:["jpg", "jpeg", "png", "webp"],
        transformation:[
            {width:1000, height:1000, crop: "limit"},
            {
                quality:"auto",
            },
            {
                fetch_format:"auto"
            }
        ],
    }
})

const uploads = multer({ storage, limits: { fieldSize: 5 * 1024 * 1024 }})


export default uploads;
