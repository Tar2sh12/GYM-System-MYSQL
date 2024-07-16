import { Router } from "express";
import * as member from './member.controller.js'
const router = Router();
router.post('/addMember',member.addMember);
router.put('/updateMember/:id',member.updateMemberRefactor)
router.get('/getSpecificMember/:id',member.getSpecificMember)
router.delete('/deleteMember/:id',member.deleteMember)
router.get('/getAllMembers',member.getAllMembers)
export default router;