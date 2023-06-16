import { Router } from "express";
import { helloWorld } from "../domain/sharedKernel/utils/HelloWorld";

const router: Router = Router()
//Routes
router.get("/", helloWorld.home);

export { router };