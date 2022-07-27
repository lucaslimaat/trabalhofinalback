const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

var conString = config.urlConnection;
var client = new Client(conString);
client.connect(function (err) {
  if (err) {
    return console.error("Não foi possível conectar ao banco.", err);
  }
  client.query("SELECT NOW()", function (err, result) {
    if (err) {
      return console.error("Erro ao executar a query.", err);
    }
    console.log(result.rows[0]);
  });
});

app.get("/", (req, res) => {
  console.log("Respose ok.");
  res.send("Ok");
});

app.get("/produtos", (req, res) => {
  try {
    client.query("SELECT * FROM Produtos", function (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Chamou get usuarios");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/produtos/:id", (req, res) => {
  try {
    console.log("Chamou /:id " + req.params.id);
    client.query(
      "SELECT * FROM Produtos  WHERE id = $1",
      [req.params.id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de SELECT id", err);
        }
        res.send(result.rows);
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});



app.listen(config.port, () =>
  console.log("Seridor funcionando na porta " + config.port)
);
