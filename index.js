const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
var cookieParser = require("cookie-parser");
var cons = require("consolidate");
const { User } = require("./routes/User");
const { CanvasRenderService } = require("chartjs-node-canvas");

const app = express();
app.use(cookieParser());

app.set("port", 8000);
app.set("views", __dirname + "/views");
app.engine("html", cons.swig);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static("images"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/chart.js/dist"));

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}
const user = new User();

app.all("/", (req, res) => {
  res.render("index", {
    title: "title",
  });
});

app.all("/authenticate", async (req, res) => {
  const { name, email } = req.body;
  res.cookie("name", name);
  res.cookie("email", email);
  user.setUserdetails(name, email);
  const response = await fetch("https://the-trivia-api.com/v2/questions").then(
    (data) => {
      return data.json();
    }
  );

  Object.keys(response).forEach((key) => {
    user.addQuestion({
      question: response[key].question.text,
      options: shuffleArray([
        response[key].correctAnswer,
        ...response[key].incorrectAnswers,
      ]),
      correctAnswer: response[key].correctAnswer,
    });
  });
  res.redirect("quiz");
});

app.all("/quiz", async (req, res) => {
  if (user.getUserDetails().email == undefined) {
    res.redirect("index");
  }
  const { name, email } = user.getUserDetails();

  res.render("quiz", {
    name: name,
    email: email,
    questions: user.getQuestions(),
  });
});

app.all("/verifyResults", (req, res) => {
  const { correct, incorrect } = user.checkAnswers(req.body);
  const results = [correct, incorrect];
  res.render("results", {
    results,
  });
});

app.listen(8000, () => {
  console.log("Server running at 8000");
});
