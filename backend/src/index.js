require('dotenv').config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");
const user = require("./routes/userRouter");
const quiz = require("./routes/quizRouter");
const subject = require("./routes/subjectRouter");
const playHistory = require("./routes/playHistoryRouter");
const playList = require("./routes/playListRouter");

const app = express();
// app.use(cors);
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads', express.static('uploads'));
  

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("::::: DB connect successful :::::");
  app.use("/user", user);
  app.use("/playhistory", auth,playHistory);
  app.use("/subject", auth, subject);
  app.use("/quiz", auth, quiz);
  app.use("/playlist", auth, playList);

}).catch((err) => {
  console.log(`### DB connection error: ${err} ###`);
});

// Start the server 
app.listen(process.env.PORT, () => {
  console.log(`::::: server running on port ${process.env.PORT} :::::`);
});

module.exports = app;
