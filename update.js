var axios = require("axios");
require("dotenv").config();
var qs = require("qs");
var data = qs.stringify({
  webhook_url: "https://webhook.site/f3f23b3e-7b78-433e-98b7-78db36ab8c51",
  webhook_secret_key: "E8fFchiDdr5rB/lpjHilPKw1sXXApXipBYH7jpQqV0o=",
});
var config = {
  method: "post",
  url: "https://integrations.getravenbank.com/v1/webhooks/update",
  headers: {
    Authorization:
    process.env.RAVEN_API_KEY,
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
