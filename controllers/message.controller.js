const Messages = require("../models/Messages");
const Users = require("../models/Users");
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
      {
        $sort: {
          createdAt: -1, // Sort in descending order based on message creation time
        },
      },
      {
        $group: {
          _id: {
            conversationId: {
              $cond: {
                if: { $eq: ["$senderId", userId] },
                then: "$receiverId",
                else: "$senderId",
              },
            },
          },
          lastMessage: { $first: "$$ROOT" }, // Get the first message in each group (i.e., the last message)
        },
      },
      {
        $replaceRoot: { newRoot: "$lastMessage" }, // Replace the root document with the last message
      },
    ]);

    const inbox = conversations.map((conversation) => {
      return {
        _id: conversation._id,
        participants: {
          participant1: conversation.senderId,
          participant2: conversation.receiverId,
        },
        lastMessage: {
          senderId: conversation.senderId,
          receiverId: conversation.receiverId,
          message: conversation.message,
          createdAt: conversation.createdAt,
        },
      };
    });

    res.json({
      message: "Data Fetch Successfully",
      inbox: inbox,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching messages");
  }
};
