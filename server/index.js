const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); 

const app = express();


app.use(cors());

const uploadsDir = path.join(__dirname, "uploads");


if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf", 
                        "application/vnd.ms-excel", 
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Set file size limit to 5MB (change as needed)
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
});

// POST route to handle file upload
app.post("/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer errors (file size limit, etc.)
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File size exceeds the limit of 5MB." });
      }
      return res.status(500).json({ message: "File upload failed (Multer error)." });
    } else if (err) {
      // Handle other errors (e.g., invalid file type)
      return res.status(400).json({ message: err.message || "File upload failed (Invalid file type)." });
    }
    // If everything goes well
    return res.status(200).json({ message: "File uploaded successfully!" });
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
