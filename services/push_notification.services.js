const { ONE_SIGNAL_CONFIG } = require("../config/config");

async function sendNotificationService(data, callback) {
  var headers = {
    "Content-Type": "application/json",
    Authorization: "Basic " + ONE_SIGNAL_CONFIG.apiKey,
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers,
  };

  var https = require("https");

  var req = https.request(options, function (res) {
    res.on("data", function (data) {
      console.log(JSON.parse(data));

      return callback(null, JSON.parse(data));
    });
  });

  req.on("error", function (e) {
    return callback({
      message: "problem with request: " + e.message,
    });
  });

  req.write(JSON.stringify(data));
  req.end();
}

module.exports = {
  sendNotificationService,
};
