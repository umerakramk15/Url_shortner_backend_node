const shortid = require("shortid");
const URL = require("../module/url");

async function handleGenerateNewShortUrl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ err: "url is required" });

  const shortID = shortid();
  await URL.create({
    shortId: shortID,
    redirectUrl: body.url,
    visitHistory: [],
    createBy : req.user._id
  });
  console.log(body);
  return res.render("home.ejs",{
    id:shortID
    
  })
  
}

module.exports = {handleGenerateNewShortUrl}
