import db_conn from "../../../DB/connection.js";

export const addMember = async (req, res, next) => {
  const { name, nat_id, phone, cost, fdate, tdate, status, trainer } = req.body;
  const Query = `
    SELECT revenue FROM trainer WHERE id=${trainer}
    `;
  let prevRev;
  db_conn.execute(Query, (err, result) => {
    if (err) {
      return res.json({
        message: err,
        result,
      });
    }
    if (result.length > 0) {
      prevRev = result[0].revenue;
      console.log(prevRev);
      const insertQuery = `
            INSERT INTO member( name, national_id, phone, cost, from_date, to_date, status, trainer_id) VALUES ('${name}','${nat_id}','${phone}','${cost}','${fdate}','${tdate}','${status}',${trainer});
            `;
      db_conn.execute(insertQuery, (err, result) => {
        if (err) {
          return res.json({
            message: err,
            result,
          });
        }
        if (!result.affectedRows) {
          return res.json({
            message: "data not inserted",
          });
        } else {
          const updateQuery = `UPDATE trainer SET revenue =${
            cost + prevRev
          }  WHERE  id=${trainer};`;
          db_conn.execute(updateQuery, (err, result) => {
            if (err) {
              return res.json({
                message: err,
                result,
              });
            }
            if (!result.affectedRows) {
              return res.json({
                message: "data not inserted",
              });
            } else {
              return res.json({
                msg: "data inserted and cost is added trainer revenue",
              });
            }
          });
        }
      });
    } else {
      return res.json({
        message: "No revenue found for the specified trainer ID",
        prevRev: null,
      });
    }
  });
};

export const updateMember = async (req, res, next) => {
  // some initializations
  let listOfKeys = Object.keys(req.body);
  const { id } = req.params;
  const dataToBeUpdated = req.body;
  let costExits = false;
  let userIsChangingTrainer = false;

  // initial update query
  let updateQuery = "UPDATE member SET ";
  //
  listOfKeys.forEach((e, i) => {
    if (e == "cost") {
      costExits = true;
    } else if (e == "trainer_id") {
      userIsChangingTrainer = true;
    }
    if (e != "trainer_id") {
      // seperated function
      updateQuery += e;
      updateQuery += "=";
      if (typeof dataToBeUpdated[e] === "number") {
        updateQuery += dataToBeUpdated[e];
      } else {
        updateQuery += "'" + dataToBeUpdated[e] + "'";
      }
      if (i < listOfKeys.length - 2) {
        updateQuery += ", ";
      } else {
        updateQuery += " ";
      }
    }
  });

  updateQuery += `WHERE id=${id}`;
  console.log(updateQuery);
  // get trainer for the existing member
  const oldTrainerIdQuery = `SELECT trainer_id FROM member WHERE id=${id}`;
  // const oldTrainerIdQuery = `SELECT trainer_id,cost FROM member WHERE id=${id}`;
  let prevTrainerId;
  db_conn.execute(oldTrainerIdQuery, (err, result) => {
    if (err) {
      return res.json({
        message: err,
        result,
      });
    } else {
      prevTrainerId = result[0]?.trainer_id;
      // we can replace this query by the commented one in line 103
      const Query = `SELECT cost FROM member WHERE id=${id}`;
      let prevRev;
      db_conn.execute(Query, (err, result) => {
        if (err) {
          return res.json({
            message: err,
            result,
          });
        }
        if (result.length > 0) {
          prevRev = result[0].cost;
          db_conn.execute(updateQuery, (err, result) => {
            if (err) {
              return res.json({
                message: err,
                result,
              });
            }
            if (!result.affectedRows) {
              return res.json({
                message: "data not updated",
              });
            } else if (costExits) {
              const idOfTraineQuery = `SELECT trainer_id FROM member WHERE id=${id}`;
              let trainerId;
              db_conn.execute(idOfTraineQuery, (err, result) => {
                if (err) {
                  return res.json({
                    message: err,
                    result,
                  });
                }
                if (result.length > 0) {
                  trainerId = result[0].trainer_id;
                  const Query = `
                                SELECT revenue FROM trainer WHERE id=${trainerId}
                                `;
                  db_conn.execute(Query, (err, result) => {
                    if (err) {
                      return res.json({
                        message: err,
                        result,
                      });
                    } else {
                      const updateQueryy = `UPDATE trainer SET revenue =${
                        result[0].revenue + dataToBeUpdated["cost"] - prevRev
                      }  WHERE  id=${trainerId};`;
                      db_conn.execute(updateQueryy, (err, result) => {
                        if (err) {
                          return res.json({
                            message: err,
                            result,
                          });
                        }
                        if (!result.affectedRows) {
                          return res.json({
                            message: "data not inserted",
                          });
                        } else {
                          if (userIsChangingTrainer) {
                            const oldMemberCostQuery = `SELECT cost FROM member WHERE id=${id}`;
                            let prevCost;
                            db_conn.execute(
                              oldMemberCostQuery,
                              (err, result) => {
                                if (err) {
                                  return res.json({
                                    message: err,
                                    result,
                                  });
                                } else {
                                  prevCost = result[0].cost;
                                  console.log({ prevCost: prevCost });
                                  const selectQuery = `SELECT revenue FROM trainer WHERE id=${dataToBeUpdated["trainer_id"]}`;
                                  let prevRevOfcurTrainer;
                                  db_conn.execute(
                                    selectQuery,
                                    (err, result) => {
                                      if (err) {
                                        return res.json({
                                          message: err,
                                          result,
                                        });
                                      } else {
                                        prevRevOfcurTrainer = result[0].revenue;
                                        console.log({
                                          prevRevOfcurTrainer:
                                            prevRevOfcurTrainer,
                                        });
                                        const updatePrevTrainer = `UPDATE trainer SET revenue =${
                                          prevRevOfcurTrainer + prevCost
                                        }  WHERE  id=${
                                          dataToBeUpdated["trainer_id"]
                                        };`;
                                        db_conn.execute(
                                          updatePrevTrainer,
                                          (err, result) => {
                                            if (err) {
                                              return res.json({
                                                message: err,
                                                result,
                                              });
                                            } else {
                                              const selectQuery = `SELECT revenue FROM trainer WHERE id=${prevTrainerId}`;
                                              let prevRevOfPrevTrainer;
                                              db_conn.execute(
                                                selectQuery,
                                                (err, result) => {
                                                  if (err) {
                                                    return res.json({
                                                      message: err,
                                                      result,
                                                    });
                                                  } else {
                                                    prevRevOfPrevTrainer =
                                                      result[0].revenue;
                                                    console.log({
                                                      prevRevOfPrevTrainer:
                                                        prevRevOfPrevTrainer,
                                                    });
                                                    const updatePrevTrainer = `UPDATE trainer SET revenue =${
                                                      prevRevOfPrevTrainer -
                                                      prevCost
                                                    }  WHERE  id=${prevTrainerId};`;
                                                    db_conn.execute(
                                                      updatePrevTrainer,
                                                      (err, result) => {
                                                        if (err) {
                                                          return res.json({
                                                            message: err,
                                                            result,
                                                          });
                                                        } else {
                                                          const updatetrainerIdInMember = `UPDATE member SET trainer_id =${dataToBeUpdated["trainer_id"]}  WHERE  id=${id};`;
                                                          db_conn.execute(
                                                            updatetrainerIdInMember,
                                                            (err, result) => {
                                                              if (err) {
                                                                return res.json(
                                                                  {
                                                                    message:
                                                                      err,
                                                                    result,
                                                                  }
                                                                );
                                                              } else {
                                                                return res.json(
                                                                  {
                                                                    msg: "new trainee and old trainee updated",
                                                                  }
                                                                );
                                                              }
                                                            }
                                                          );
                                                        }
                                                      }
                                                    );
                                                  }
                                                }
                                              );
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          } else {
                            return res.json({
                              msg: "data updated and cost is updated in trainer revenue",
                            });
                          }
                        }
                      });
                    }
                  });
                }
              });
            } else if (!costExits && userIsChangingTrainer) {
              const oldMemberCostQuery = `SELECT cost FROM member WHERE id=${id}`;
              let prevCost;
              db_conn.execute(oldMemberCostQuery, (err, result) => {
                if (err) {
                  return res.json({
                    message: err,
                    result,
                  });
                } else {
                  prevCost = result[0].cost;
                  console.log({ prevCost: prevCost });
                  const selectQuery = `SELECT revenue FROM trainer WHERE id=${prevTrainerId}`;
                  let prevRevOfPrevTrainer;
                  db_conn.execute(selectQuery, (err, result) => {
                    if (err) {
                      return res.json({
                        message: err,
                        result,
                      });
                    } else {
                      prevRevOfPrevTrainer = result[0].revenue;
                      console.log({
                        prevRevOfPrevTrainer: prevRevOfPrevTrainer,
                      });
                      const updatePrevTrainer = `UPDATE trainer SET revenue =${
                        prevRevOfPrevTrainer - prevCost
                      }  WHERE  id=${prevTrainerId};`;
                      db_conn.execute(updatePrevTrainer, (err, result) => {
                        if (err) {
                          return res.json({
                            message: err,
                            result,
                          });
                        } else {
                          const selectQuery = `SELECT revenue FROM trainer WHERE id=${dataToBeUpdated["trainer_id"]}`;
                          let prevRevOfcurTrainer;
                          db_conn.execute(selectQuery, (err, result) => {
                            if (err) {
                              return res.json({
                                message: err,
                                result,
                              });
                            } else {
                              prevRevOfcurTrainer = result[0].revenue;
                              console.log({
                                prevRevOfcurTrainer: prevRevOfcurTrainer,
                              });
                              const updatePrevTrainer = `UPDATE trainer SET revenue =${
                                prevRevOfcurTrainer + prevCost
                              }  WHERE  id=${dataToBeUpdated["trainer_id"]};`;
                              db_conn.execute(
                                updatePrevTrainer,
                                (err, result) => {
                                  if (err) {
                                    return res.json({
                                      message: err,
                                      result,
                                    });
                                  } else {
                                    const updatetrainerIdInMember = `UPDATE member SET trainer_id =${dataToBeUpdated["trainer_id"]}  WHERE  id=${id};`;
                                    db_conn.execute(
                                      updatetrainerIdInMember,
                                      (err, result) => {
                                        if (err) {
                                          return res.json({
                                            message: err,
                                            result,
                                          });
                                        } else {
                                          return res.json({
                                            msg: "new trainee and old trainee updated",
                                          });
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            } else {
              return res.json({
                msg: "data updated successfully",
              });
            }
          });
        }
      });
    }
  });
};

export const getSpecificMember = async (req, res, next) => {
  const { id } = req.params;
  const selectQuery = `SELECT * FROM member WHERE id=${id}`;
  db_conn.execute(selectQuery, (err, result) => {
    if (err) {
      return res.json({
        message: err,
        result,
      });
    } else {
      const currentDate = new Date();
      if (
        currentDate >= result[0].from_date &&
        currentDate <= result[0].to_date
      ) {
        return res.json({ message: result });
      } else {
        return res.json({
          message: "this member is not allowed to enter the gym",
        });
      }
    }
  });
};

export const deleteMember = async (req, res, next) => {
  const { id } = req.params;
  const selectQuery = `SELECT cost,trainer_id FROM member WHERE id=${id}`;
  let cost;
  let oldRev;
  let trainerId;
  // const deleteQuery=`DELETE FROM member WHERE id=${id}`
  db_conn.execute(selectQuery, (err, result) => {
    if (err) {
      return res.json({
        message: err,
        result,
      });
    } else {
      cost = result[0].cost;
      trainerId = result[0].trainer_id;
      const selectOldrev = `SELECT revenue FROM trainer WHERE id=${trainerId} `;
      let prevRev;
      db_conn.execute(selectOldrev, (err, result) => {
        if (err) {
          return res.json({
            message: err,
            result,
          });
        } else {
          prevRev = result[0].revenue;
          const updateTrainer = `UPDATE trainer SET revenue =${
            prevRev - cost
          }  WHERE  id=${trainerId};`;
          db_conn.execute(updateTrainer, (err, result) => {
            if (err) {
              return res.json({
                message: err,
                result,
              });
            } else {
              const deleteQuery = `DELETE FROM member WHERE id=${id}`;
              db_conn.execute(deleteQuery, (err, result) => {
                if (err) {
                  return res.json({
                    message: err,
                    result,
                  });
                } else {
                  return res.json({ msg: "member deleted successfully" });
                }
              });
            }
          });
        }
      });
    }
  });
};

export const getAllMembers = async (req, res, next) => {
  const selectQuery = `SELECT member.*,trainer.* FROM member inner join trainer on member.trainer_id=trainer.id

    `;
  db_conn.execute(selectQuery, (err, result) => {
    if (err) {
      return res.json({
        message: err,
        result,
      });
    } else {
      return res.json({ msg: result });
    }
  });
};

// async and await way

export const updateMemberRefactor = async (req, res, next) => {
  // some initializations
  let listOfKeys = Object.keys(req.body);
  const { id } = req.params;
  const dataToBeUpdated = req.body;
  let costExits = false;
  let userIsChangingTrainer = false;
  let prevRevOfPrevTrainer;

  // initial update query
  let updateQuery = "UPDATE member SET ";
  //
  listOfKeys.forEach((e, i) => {
    if (e == "cost") {
      costExits = true;
    } else if (e == "trainer_id") {
      userIsChangingTrainer = true;
    }
    if (e != "trainer_id") {
      // seperated function
      updateQuery += e;
      updateQuery += "=";
      if (typeof dataToBeUpdated[e] === "number") {
        updateQuery += dataToBeUpdated[e];
      } else {
        updateQuery += "'" + dataToBeUpdated[e] + "'";
      }
      if (i < listOfKeys.length - 2) {
        updateQuery += ", ";
      } else {
        updateQuery += " ";
      }
    }
  });

  updateQuery += `WHERE id=${id}`;

  console.log(updateQuery);
  // get trainer for the existing member
  const oldTrainerIdQuery = `SELECT trainer_id,cost FROM member WHERE id=${id}`;
  let prevTrainerId;
  db_conn.execute(oldTrainerIdQuery, (err, result) => {
    if (err) {
      return res.json({
        message: err,
        result,
      });
    } else {
      prevTrainerId = result[0]?.trainer_id;
      let prevRev = result[0]?.cost; // before update
      db_conn.execute(updateQuery, async (err, result) => {
        if (err) {
          return res.json({
            message: err,
            result,
          });
        }
        if (!result.affectedRows) {
          return res.json({
            message: "data not updated",
          });
        } else if (costExits || userIsChangingTrainer) {
          const Query = `SELECT revenue FROM trainer WHERE id=${prevTrainerId}`;
          console.log({ Query });
          db_conn.execute(Query, (err, result) => {
            if (err) {
              return res.json({
                message: err,
                result,
              });
            }
            console.log({ ee: result[0] });
            prevRevOfPrevTrainer = result[0]?.revenue; // revenue
             if (costExits) {
              let trainerId = prevTrainerId;
              db_conn.execute(Query, (err, result) => {
                if (err) {
                  return res.json({
                    message: err,
                    result,
                  });
                } else {
                  prevRevOfPrevTrainer = result[0].revenue;
                  const updateQueryy = `UPDATE trainer SET revenue =${
                    result[0].revenue + dataToBeUpdated["cost"] - prevRev
                  }  WHERE  id=${trainerId};`;
                  db_conn.execute(updateQueryy, (err, result) => {
                    if (err) {
                      return res.json({
                        message: err,
                        result,
                      });
                    }
                    if (!result.affectedRows) {
                      return res.json({
                        message: "data not inserted",
                      });
                    } else {
                      if (userIsChangingTrainer) {
                        let prevCost = prevRev;
                        const selectQuery = `SELECT revenue FROM trainer WHERE id=${dataToBeUpdated["trainer_id"]}`;
                        console.log('==================selectQuery=================');
                        console.log({selectQuery});
                        let prevRevOfcurTrainer;
                        db_conn.execute(selectQuery, (err, result) => {
                          if (err) {
                            return res.json({
                              message: err,
                              result,
                            });
                          } else {
                            prevRevOfcurTrainer = result[0].revenue;
                            console.log({
                              prevRevOfcurTrainer: prevRevOfcurTrainer,
                            });
                            const updatePrevTrainer = `UPDATE trainer SET revenue =${
                              prevRevOfcurTrainer + dataToBeUpdated['cost']
                            }  WHERE  id=${dataToBeUpdated["trainer_id"]};`;
                            console.log({updatePrevTrainer});
                            db_conn.execute(updatePrevTrainer, (err, result) => {
                              if (err) {
                                return res.json({
                                  message: err,
                                  result,
                                });
                              } else {
                                // let prevRevOfPrevTrainer = result[0].revenue;
                                console.log({
                                  prevRevOfPrevTrainer: prevRevOfPrevTrainer,
                                });
                                const updatePrevTrainer = `UPDATE trainer SET revenue =${
                                  prevRevOfPrevTrainer - prevCost
                                }  WHERE  id=${prevTrainerId};`;
                                db_conn.execute(
                                  updatePrevTrainer,
                                  (err, result) => {
                                    if (err) {
                                      return res.json({
                                        message: err,
                                        result,
                                      });
                                    } else {
                                      const updatetrainerIdInMember = `UPDATE member SET trainer_id =${dataToBeUpdated["trainer_id"]}  WHERE  id=${id};`;
                                      db_conn.execute(
                                        updatetrainerIdInMember,
                                        (err, result) => {
                                          if (err) {
                                            return res.json({
                                              message: err,
                                              result,
                                            });
                                          } else {
                                            return res.json({
                                              msg: "new trainee and old trainee updated",
                                            });
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            });
                          }
                        });
                      } else {
                        return res.json({
                          msg: "data updated and cost is updated in trainer revenue",
                        });
                      }
                    }
                  });
                }
              });
            } else if (!costExits && userIsChangingTrainer) {
              let prevCost = prevRev;
              console.log({
                prevRevOfPrevTrainer,
                prevCost,
              });
              const updatePrevTrainer = `UPDATE trainer SET revenue =${
                prevRevOfPrevTrainer - prevCost
              }  WHERE  id=${prevTrainerId};`;
              db_conn.execute(updatePrevTrainer, (err, result) => {
                if (err) {
                  return res.json({
                    message: err,
                    result,
                  });
                } else {
                  const selectQuery = `SELECT revenue FROM trainer WHERE id=${dataToBeUpdated["trainer_id"]}`;
                  let prevRevOfcurTrainer;
                  db_conn.execute(selectQuery, (err, result) => {
                    if (err) {
                      return res.json({
                        message: err,
                        result,
                      });
                    } else {
                      prevRevOfcurTrainer = result[0].revenue;
                      console.log({
                        prevRevOfcurTrainer: prevRevOfcurTrainer,
                      });
                      const updatePrevTrainer = `UPDATE trainer SET revenue =${
                        prevRevOfcurTrainer + prevCost
                      }  WHERE  id=${dataToBeUpdated["trainer_id"]};`;
                      db_conn.execute(updatePrevTrainer, (err, result) => {
                        if (err) {
                          return res.json({
                            message: err,
                            result,
                          });
                        } else {
                          const updatetrainerIdInMember = `UPDATE member SET trainer_id =${dataToBeUpdated["trainer_id"]}  WHERE  id=${id};`;
                          db_conn.execute(
                            updatetrainerIdInMember,
                            (err, result) => {
                              if (err) {
                                return res.json({
                                  message: err,
                                  result,
                                });
                              } else {
                                return res.json({
                                  msg: "new trainee and old trainee updated",
                                });
                              }
                            }
                          );
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          return res.json({
            msg: "data updated successfully",
          });
        }
      });
    }
  });
};

async function test(prevTrainerId) {
  let prevRevOfPrevTrainer;
  const Query = `SELECT revenue FROM trainer WHERE id=${prevTrainerId}`;
  console.log({ Query });
  db_conn.execute(Query, (err, result) => {
    if (err) {
      return res.json({
        message: err,
        result,
      });
    }
    console.log({ ee: result[0] });
    prevRevOfPrevTrainer = result[0]?.revenue; // revenue
    // prevRevOfPrevTrainerglobal =  prevRevOfPrevTrainer;
  });

  return prevRevOfPrevTrainer;
}
