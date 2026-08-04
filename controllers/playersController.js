
const pool = require("../config/db");

async function getPlayers(req, res, next){

       try {

                const { rank } = req.query;

                let result;

                if(rank){

                    result = await
        pool.query(

        "SELECT * FROM players WHERE rank = $1",

        [rank]

        );

        }else{

           result = await
        pool.query(
            "SELECT * FROM players"
                );

        }

        res.json(result.rows);

     } catch (err) {

        next(err);
    }

}

async function getPlayer(req, res){

	const id = req.params.id;

        const result = await pool.query(
                "SELECT * FROM players WHERE id = $1" ,
                [id]
        );

        res.json(result.rows);

}

async function createPlayer(req,res){

   try {
             const { name, rank = "Apprentice", joined }
        = req.body;

             const result = await
        pool.query(
                       `INSERT INTO players
                (name, rank, joined)
                        VALUES ($1, $2, $3)
                        RETURNING *`,
                        [name, rank, joined]
                      );

        res.status(201).json(result.rows[0]);

                } catch (err) {

                next(err);
        }
}

async function deletePlayer(req,res){

   try{

                const id = req.params.id;

        await pool.query(

        "DELETE FROM players WHERE id = $1",

                        [id]

                     );

                res.json({
                        message: "Player Deleted"

                });

             }catch(err){

                next(err);
        }
}

async function updatePlayer(req, res){

     try {

                const id = req.params.id;

                const { name, rank } =
        req.body;

                const result = await
        pool.query(
                        `UPDATE players

                        SET name = $1,
                            rank = $2

                        Where id = $3

                        RETURNING *`,

                        [name, rank, id]

                  );

                res.json(result.rows[0]);

              }catch(err){

           	 next(err);
        }
}


module.exports = { getPlayers, getPlayer, createPlayer, deletePlayer, updatePlayer };
