//express 
import express, { json } from 'express';
const app = express();
import db_conn from './DB/connection.js';
import statsRouter from './src/modules/stats/stats.routes.js'
import trainerRouter from './src/modules/trainer/trainer.routes.js'

import memberRouter from './src/modules/member/member.routes.js'
app.use(json())
app.use('/member',memberRouter)
app.use('/trainer',trainerRouter)
app.use('/stats',statsRouter)
db_conn
app.listen(3004,()=>{
    console.log('runing on port 3004');
})



