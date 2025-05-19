import path from 'path';
import dotenv from 'dotenv';

import { v2 as cloudinary } from 'cloudinary';
dotenv.config({ path: path.join("../config/", ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


console.log(process.env.CLOUDINARY_URL);


const fetchAssets = async () => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500
    });

    console.log(result.resources);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

fetchAssets();
