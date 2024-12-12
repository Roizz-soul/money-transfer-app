// Updating Webhook details to raven atlas

var axios = require("axios");
require("dotenv").config();
var qs = require("qs");
var data = qs.stringify({
  webhook_url: process.env.WEBHOOK_URL,
  webhook_secret_key: process.env.WEBHOOK_SECRET,
});
var config = {
  method: "post",
  url: "https://integrations.getravenbank.com/v1/webhooks/update",
  headers: {
    Authorization: process.env.RAVEN_API_KEY,
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
