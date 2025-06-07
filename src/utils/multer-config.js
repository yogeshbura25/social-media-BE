import multer from 'multer';
import path from 'path';

// For profile photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/photos');
  },
  filename: function (req, file, cb) {
    const uniqueName = `photo_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
export const upload = multer({ storage });

// For posts
const storagePost = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/post');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = "post_" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});
export const uploadPost = multer({ storage: storagePost }); 
