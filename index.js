const express = require("express");
const URL = require("./module/url");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const { connecttoMongoose } = require("./connection");

const { restrictToLoggedInUserOnly, checkAuth } = require("./middleware/auth");
const PORT = 8001;

const urlROUTE = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRouter = require("./routes/user");

app.use(cookieParser());
app.set("views engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connecttoMongoose("mongodb://127.0.0.1:27017/shortUrl")
  .then(() => {
    console.log("Mongoose Connected");
  })
  .catch((err) => {
    console.log("Error is : ", err);
  });

app.use("/url", restrictToLoggedInUserOnly, urlROUTE);
app.use("/user", userRouter);
app.use("/", checkAuth, staticRouter);
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );

  res.redirect(entry.redirectUrl.toString());
});

app.get("/analytics/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({ shortId });

  if (!entry) res.status(404).json({ err: " Data not found " });

  return res.status(201).json({ numberOfClick: entry.visitHistory.length });
});

app.listen(PORT, () => {
  console.log(`Server Started at PORT : ${PORT}`);
});
