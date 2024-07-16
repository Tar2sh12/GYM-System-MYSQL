import { Router } from "express";
import * as stats from './stats.controller.js'
const router = Router();
router.get('/allRevenue',stats.getAllRevenue)
router.get('/getRevenue/:id',stats.getRevenue)
export default router;