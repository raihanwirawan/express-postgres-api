require("dotenv").config();

const express = require("express");

const fs = require("fs")

const playersRoute = require("./routes/players");

const errorHandler = require("./middleware/errorHandler");

const app = express();

const pool = require("./config/db");

let players = JSON.parse(
	fs.readFileSync("players.json")
);

console.log(players);

const monsters = {
        gargantuan: {
          type: "Sea Monster" ,
          length: "19ft - 30ft"
        },

        cretaros: {
          type: "Minotauros" ,
          height: "10ft - 12ft"
        },

        gresokar: {
          type: "Ice Dragon" ,
          height: "40ft - 78ft"
        }
};

app.use(express.json()

);

app.use((req, res, next) => {
        console.log(new Date().toISOString(),
  req.method, req.url);

      next();
});

app.use("/players", playersRoute

);

app.get("/hello", (req, res) => {

        console.log(req.query.name);

        res.send("Hello " + req.query.name );

})

app.get("/monster/:name", (req, res) => {

        let monster = monsters[req.params.name.toLowerCase()];

        console.log(monster);

        res.json(monster);

})

app.get("/player/:name", (req, res) => {

        console.log(req.url);

        let player = players[req.params.name.toLowerCase()];

        console.log(player);

        res.json(player);

})

app.get("/", (req, res) => {

        console.log("[HOME] Route accessed");

    res.json({
        server: "online"
       })
})

app.get("/player", (req, res) => {

        console.log("[PLAYER] Profile Viewed");

    res.json({
        name: "Kevin" ,
        level: 50 ,
        gold: 216000
      })
})

app.get("/stats", (req, res) => {

        console.log("[STATS] Stats checked");

    res.json({
        monsterKilled: 70 ,
        questCompleted: 71
      })
})

app.get("/about", (req, res) => {

        console.log("[ABOUT] About viewed");

    res.json({
        developer: "Kevin" ,
        learning: "node.js"
      })
})

app.use((req, res) => {

    res.status(404).json({
        error: "Route Not Found"
   });
})

app.use(errorHandler);

app.listen(process.env.PORT || 8000, () => {
        console.log("Server Activated")
})
