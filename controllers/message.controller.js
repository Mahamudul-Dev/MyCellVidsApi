const Messages = require("../models/Messages");
const { ObjectId } = require("mongoose").Types;

module.exports.getMessages = async (req, res, next) => {
  try {
    const senderId = new ObjectId(req.userId);
    const receiverId = new ObjectId(req.body.receiverId);

    const messages = await Messages.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.json({ messages: messages });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
};

module.exports.getAllConversations = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.userId);

    const conversations = await Messages.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
    ]);

    res.json({ conversations: conversations });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching messages");
  }
};
