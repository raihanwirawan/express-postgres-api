const express = require("express")

const router = express.Router();

router.get("/players", async (req, res) => {

        try {

                const { rank,limit } = req.query;

                let result;

                if(rank){

                    result = await
        pool.query(

        "SELECT * FROM players WHERE rank = $1 LIMIT $2",

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

        console.error(err);

        res.status(500).json({
                error: "Database Error"
        });
    }
})

router.get("/players/:id", async (req, res) => {

        const id = req.params.id;

        const result = await pool.query(
                "SELECT * FROM players WHERE id = $1" ,
                [id]
        );

        res.json(result.rows);

})

router.post("/players", async (req, res) => {

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

                console.error(err);

                res.status(500).json({
                        error: "Database Error"
                });
        }
})

router.post("/player", (req, res) => {

        players[req.body.name.toLowerCase()] = {

        sinced: req.body.sinced ,
        rank: req.body.rank
        };

        fs.writeFileSync(
           "players.json",
           JSON.stringify(players, null, 4)
       );

        res.json({
          message: "Player saved"
        });
})

router.delete("/player/:name", (req, res) => {

        let name = req.params.name.toLowerCase();

        console.log(name);

        delete players[name];

        fs.writeFileSync(
           "players.json",
           JSON.stringify(players,null, 4)
        );

        res.json({
          message: "Player deleted"
        });

})

router.delete("/players/:id", async (req, res) => {

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

                console.error(err);

                res.status(500).json({

                        error:"Database Error"

                });
        }
})

router.put("/players/:id", async (req, res) => {

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

        } catch(err){

                console.error(err);

                res.status(500).json({
                        error: "Database Error"
                });
        }
})

router.put("/player/:name", (req, res) => {

        let name = req.params.name.toLowerCase();

        req.body.rank

        players[name].rank = req.body.rank;

        fs.writeFileSync(
           "players.json" ,
           JSON.stringify(players,null, 4)
        );

        res.json({
          message: "Player Updated"
        });

});

module.exports = router;
