var express = require("express");
var bodyParser = require("body-parser");
var db = require("../database-mongo");
var bcrypt = require("bcryptjs");

var app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(express.static(__dirname + "/../react-client/dist"));

app.get("/api/profs", function (req, res) {
  db.selectAllProf(function (err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.post("/api/workers", function (req, res) {
  db.selectWorkers(req.body.prof, function (err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log("data", data);
      res.json(data);
    }
  });
});

app.post("/login", (req, res) => {
  let givenPassword = req.body.password;
  console.log(req.body);
  db.selectOneWorker(req.body, (err, worker) => {
    if (err) {
      res.sendStatus(500);
    } else {
      if (!worker) {
        db.selectOneUser(req.body, (err, user) => {
          if (err) {
            res.sendStatus(500);
          } else {
            let validPass = bcrypt.compare(
              givenPassword,
              user.password,
              function (err, result) {
                if (err) {
                  console.log("compare error", err);
                } else if (result) {
                  console.log("user password matches.", result);
                  // To do: if compare true user must be redirected to feed
                }
              }
            );
            if (!validPass) return res.send("Invalid password");
            let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            res.status(200).header("auth-token", token), send(token);
          }
        });
      } else {
        let validPass = bcrypt.compare(
          givenPassword,
          worker.password,
          function (err, result) {
            if (err) {
              console.log("compare error", err);
            } else {
              console.log("worker password matches", result);
              // To do: if compare true worker must be redirected to feed
            }
          }
        );
        if (!validPass) return res.send("Invalid password");
        let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.status(200).header("auth-token", token), send(token);
      }
    }
  });
});

app.post("/workerRegister", (req, res) => {
  console.log(req.body);
  var data = req.body;
  data.rate = 0;
  db.addWorker(data, (err, worker) => {
    if (err) {
      res.send("Worker not created");
    } else {
      console.log("Worker created successfully");
      res.json(worker);
    }
  });
});

app.post("/userRegister", (req, res) => {
  db.addUser(req.body, (err, user) => {
    if (err) {
      res.send("User not created");
    } else {
      res.json(user);
    }
    console.log("User created successfully");
  });
});

app.get("/orders", function (req, res) {
  db.selectAllOrders(function (err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});
app.post("/api/orders/panding", function (req, res) {
  console.log(req.body.data);
  db.selectWorkerPandingOrders(req.body.data, function (err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});
app.post("/api/orders/doing", function (req, res) {
  console.log(req.body.data);
  db.selectWorkerDoingOrders(req.body.data, function (err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});
app.post("/api/orders/done", function (req, res) {
  console.log(req.body.data);
  db.selectWorkerDoneOrders(req.body.data, function (err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});
app.put("/order/update", function (req, res) {
  console.log(req.body);
  db.updateOrder(req.body, function (err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});
app.listen(3000, function () {
  console.log("listening on port 3000!");
});
