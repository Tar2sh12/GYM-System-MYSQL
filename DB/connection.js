//write only open of the connection
//sql => tables
//key-value => collections
import express from 'express';
import mysql2 from 'mysql2';
const db_conn=mysql2.createConnection({
    host:'localhost',//127.0.0.1
    database:'gym_db',
    user:'root',
    password:''
})
db_conn.connect((er)=>{
    if(er){
        console.log('error found in connection to db '+ er);
    }
    else{
        console.log('connected to db');
    }
})
export default db_conn;