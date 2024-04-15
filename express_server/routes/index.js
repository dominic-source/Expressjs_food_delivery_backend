import { Router } from "express";
import UserControllers from "../controllers/UserControllers";

const router = Router();
 
router.post('/user', UserControllers.users);
module.exports = router;
