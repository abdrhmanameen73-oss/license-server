const express = require("express");
const app = express();

const licenses = {
  "client1": true,
  "client2": true
};

app.get("/check", (req, res) => {
  const client = req.query.client;
  if (licenses[client]) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("License server running");
});
