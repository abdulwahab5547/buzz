import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // User who will receive the notification
        required: true,
    },
    type: {
        type: String,
        enum: ['comment', 'post', 'message', 'reel', 'follow'], // Types of notifications
        required: true,
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Reference to the entity (Post, Comment, Message, Reel) depending on the type
    },
    message: {
        type: String,
        required: true, // Descriptive message of the notification
    },
    read: {
        type: Boolean,
        default: false, // Whether the notification has been read
    },
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for the notification creation
    }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now },
  });

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        maxLength: 500,
    },
    image: {
        type: String,
    },
    location: {
        type: String,
    },
    hashtags: {
        type: String,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',  // Reference to the Comment model
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true,
    }
}, { timestamps: true });

const savedPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', 
        required: true,
    },
}, { timestamps: true });

const likedPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', 
        required: true,
    },
}, { timestamps: true });

// <i class="fa-regular fa-face-laugh"></i>
/* <i class="fa-solid fa-heart"></i> */
// <i class="fa-regular fa-face-sad-cry"></i>
// <i class="fa-regular fa-face-angry"></i>

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model who made the comment
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',  // Reference to the Post that the comment belongs to
        required: true,
    }
}, { timestamps: true });

const reelSchema = new mongoose.Schema({
    caption: {
        type: String,
        maxLength: 500,
    },
    video: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const followSchema = new mongoose.Schema({
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    workCompany: {
        type: String,
    },
    twitter: {
        type: String,
    },
    instagram: {
        type: String,
    },
    profileImage: {
        type: String
    },
    bio: {
        type: String
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);
const Post = mongoose.model("Post", postSchema);
const Reel = mongoose.model("Reel", reelSchema);
const Comment = mongoose.model("Comment", commentSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const SavedPost = mongoose.model("SavedPost", savedPostSchema);
const LikedPost = mongoose.model("LikedPost", likedPostSchema);
const Follow = mongoose.model('Follow', followSchema);


// Define standalone functions for User
const findOne = async (criteria) => {
    try {
        return await User.findOne(criteria);
    } catch (error) {
        throw new Error(error);
    }
};

const findById = async (id) => {
    try {
        return await User.findById(id);
    } catch (error) {
        throw new Error(error);
    }
};

const findByUsername = async (username) => {
    try {
        return await User.findOne({ username });
    } catch (error) {
        throw new Error(error);
    }
};

const findByIdAndUpdate = async (id, update) => {
    try {
        return await User.findByIdAndUpdate(id, update, { new: true });
    } catch (error) {
        throw new Error(error);
    }
};

export { Follow, LikedPost, SavedPost, Notification, Post, Comment, Reel, User, Message, findOne, findById, findByIdAndUpdate, findByUsername };