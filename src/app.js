import express from "express";
import cors from "cors";
import config from "./configs/index.js";
import authRouter from "./router/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.use((req, res, next) => {
  const err = new Error();
  err.message = "Not found";
  err.status = 404;

  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: err.errors || err.message || "Server error",
  });
});

app.listen(config.port, () => console.log("Now serving"));
