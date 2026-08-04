
const express = require("express")

const router = express.Router();

const pool = require("../config/db");

const { getPlayers, getPlayer, createPlayer, deletePlayer, updatePlayer } =
require("../controllers/playersController");

router.get("/", getPlayers);

router.get("/:id", getPlayer);

router.post("/", createPlayer);

router.delete("/:id", deletePlayer);

router.put("/:id", updatePlayer);

module.exports = router;
