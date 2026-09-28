require("dotenv").config();

const express = require("express");

const playersRoute = require("./routes/players");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json()

);

app.use((req, res, next) => {
        console.log(new Date().toISOString(),
  req.method, req.url);

      next();
});

app.use("/players", playersRoute

);

app.get("/", (req, res) => {

        console.log("[HOME] Route accessed");

    res.json({
        server: "online"
       })
})

app.use((req, res) => {

    res.status(404).json({
        error: "Route Not Found"
   });
})

app.use(errorHandler);

// Project local development server

app.listen(process.env.PORT || 8000, () => {
        console.log("Server Activated")
});

