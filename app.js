//!importing : start
const express = require("express");
require("dotenv").config();
const notFound = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");
const connectDB = require("./db/connect");
require("express-async-errors");
const authenticationRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const auth = require("./middleware/authentication");
//!importing : end

const app = express();
app.use(express.json());

//! middlewares : start
app.get("/", (req, res) => {
  res.send("hello there");
});
app.use("/api/v1/auth", authenticationRouter);
app.use("/api/v1/jobs", auth, jobsRouter); //! every route in jobs now is secure
//! middlewares : end

//! handling errors + other middlewares : start
app.use(notFound);
app.use(errorHandlerMiddleWare);
//! handling errors + other middlewares : end

const port = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI); //todo please test it without the await
    app.listen(port, () => {
      console.log(`Server Is listening to the ${port} port...`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
