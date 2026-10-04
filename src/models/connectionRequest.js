const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignore", "accepted", "interested", "rejected"],
                message: `{VALUE} incorrect status type`
            }
        }
    },
    {
        timestamps: true,
    }
);

//can also be written in requestRouter, this is just another way
connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("fromUserId cannot be same as toUserId");
    }
    //next() is depricated for pre
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);