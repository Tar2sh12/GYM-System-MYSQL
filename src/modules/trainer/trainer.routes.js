import { Router } from "express";
import * as trainer from './trainer.controller.js'
const router = Router();
router.post('/addTrainer',trainer.addTrainer);
router.put('/updateTrainer/:id',trainer.updateTrainer)
router.delete('/deleteTrainer/:id',trainer.deleteTrainer)
router.get('/getSpecificTrainer/:id',trainer.getSpecificTrainer)
export default router;