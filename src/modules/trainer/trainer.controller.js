import db_conn from '../../../DB/connection.js'

export const addTrainer=async (req,res,next)=>{
    const {name,fdate,tdate}=req.body;
    const insertQuery=`
    INSERT INTO trainer(name, from_date, to_date) VALUES ('${name}','${fdate}','${tdate}')
    `
    // INSERT INTO users(name, email, pass, gender) VALUES ('${name}','${email}','${password}','${gender}')
    db_conn.execute(insertQuery,(err,result)=>{
        if(err){
            return res.json({
                message:err,
                result
            })
        }
        if(!result.affectedRows){
            return res.json({
                message:"data not inserted"
            })
        }
        return res.json({
            message:"data inserted",

        })
        
    })
}

export const updateTrainer=async (req,res,next)=>{
let listOfKeys = Object.keys(req.body);
const { id } = req.params;
const dataToBeUpdated = req.body;
let updateQuery = "UPDATE trainer SET ";
listOfKeys.forEach((e, i) => {
    updateQuery += e;
    updateQuery += "=";
    if (typeof dataToBeUpdated[e] === "number") {
      updateQuery += dataToBeUpdated[e];
    } else {
      updateQuery += "'" + dataToBeUpdated[e] + "'";
    }
    if (i < listOfKeys.length - 1) {
      updateQuery += ", ";
    } else {
      updateQuery += " ";
    }
});
updateQuery += `WHERE id=${id}`;

db_conn.execute(updateQuery, (err, result) => {
    if (err) {
      return res.json({
        message: err,
        result,
      });
    }
    if (!result.affectedRows) {
      return res.json({
        message: "data does not updated",
      });
    }
    else{
        return res.json({msg:"data updated successfully"})
    }
}
)
}

export const deleteTrainer = async (req, res, next) => {
    const { id } = req.params;

    const deleteQuery=`DELETE FROM trainer WHERE id=${id}`
    db_conn.execute(deleteQuery, (err, result) => {
        if (err) {
          return res.json({
            message: err,
            result,
          });
        }
        if (!result.affectedRows) {
          return res.json({
            message: "data does not deleted",
          });
        }
        else{
            return res.json({msg:"data deleted successfully"})
        }
    }
    )
}
export const getSpecificTrainer = async (req, res, next) => {
    const { id } = req.params;
    const selectQuery = `SELECT trainer.*,member.* FROM trainer join member on member.trainer_id=trainer.id  WHERE trainer.id=${id}`;
    db_conn.execute(selectQuery, (err, result) => {
      if (err) {
        return res.json({
          message: err,
          result,
        });
      } else {
          return res.json({ message: result });
      }
    });
  };
  