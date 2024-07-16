import db_conn from '../../../DB/connection.js'
export const getAllRevenue = async (req, res, next) => {
    const selectQuery=`SELECT SUM(revenue) FROM trainer`
    db_conn.execute(selectQuery, (err, result) => {
        if (err) {
          return res.json({
            message: err,
            result,
          });
        }
        else{
            return res.json({msg:result})
        }
    }
    )
}
export const getRevenue = async (req, res, next) => {
    const { id } = req.params;
    const selectQuery=`SELECT revenue FROM trainer WHERE id=${id}`
    db_conn.execute(selectQuery, (err, result) => {
        if (err) {
          return res.json({
            message: err,
            result,
          });
        }
        else{
            return res.json({msg:result})
        }
    }
    )
}