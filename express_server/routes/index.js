import { Router } from "express";
import multer from 'multer';
import UserControllers from "../controllers/userControllers";
import { allowedExtensions } from "../utils/allowedextension";

// Setup storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/uploads')
    },
    filename: function (req, file, cb) {
      if (allowedExtensions(file.fieldname, file.mimetype)) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniquePrefix + '-' + file.fieldname + `.${file.mimetype.split('/')[1]}`);
      } else cb(null, file.fieldname+uniquePrefix);
    }
  });
const upload = multer({ storage: storage });
  
const router = Router();

router.post('/login', UserControllers.login); 
router.post('/uploads', upload.single('toUploadFile'), UserControllers.upload);
module.exports = router;
