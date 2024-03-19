import { Router } from "express";
import UserControllers from "../controllers/UserControllers";

const router = Router();
 
router.get('/user', UserControllers.users);
module.exports = router;
