import multer from "multer";
import path from "path";

// diskStorage accepts an object with two properties
const storage = multer.diskStorage({
  destination: "uploads/",

  // _ is request object, It never used here so, _ is used by convention.
  // file - information about the uploaded files
  // cb - this is callback function, Multer uses to return the filename
  filename: (_, file, cb) => {
    // here I did - Math.random()/=*1e9 -> cuz It generates long random number
    // it reduces the chance of two files getting the same name
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // call the callback to tell me multer - no error, final file name
    cb(null, unique + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});
