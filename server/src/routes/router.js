import { Router } from "express";
import authRouter from "./authRouter.js";
import issueRouter from "./issueRouter.js";
import projectRouter from "./projectRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.get("/",(req,res)=>{
    res.send("hola mundo")
})

router.use("",authRouter);
router.use("/issue",issueRouter);
router.use("/project",projectRouter);
router.use("/user",userRouter);

export default router