const { ONE_SIGNAL_CONFIG } = require("../config/config");
const pushNotificationService = require("../services/push_notification.services");
module.exports.sendNotification = async (req, res, next) => {
  try {
    var message = {
      app_id: ONE_SIGNAL_CONFIG.appId,
      contents: { en: "Notification from MyCellVids" },
      include_segments: ["All"],
      content_available: true,
      small_icon: "ic_notification",
      data: {
        PushTitle: "Custom Notification from MyCellVids",
      },
    };

    pushNotificationService.sendNotificationService(
      message,
      (error, results) => {
        if (error) {
          return next(error);
        }

        return res.status(200).send({
          status: "success",
          message: "Notification sent successfully",
          data: results,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports.sendNotificationDevice = async (req, res, next) => {
  try {
    var message = {
      app_id: ONE_SIGNAL_CONFIG.appId,
      contents: { en: "Notification from MyCellVids" },
      include_segments: ["include player ids"],
      include_player_ids: req.body.devices,
      content_available: true,
      small_icon: "ic_notification",
      data: {
        PushTitle: "Custom Notification from MyCellVids",
      },
    };

    pushNotificationService.sendNotificationService(
      message,
      (error, results) => {
        if (error) {
          return next(error);
        }

        return res.status(200).send({
          status: "success",
          message: "Notification sent successfully",
          data: results,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
