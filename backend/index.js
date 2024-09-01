import express, { Router, json } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import multer from "multer";
const app = express()
import { unlinkSync, existsSync } from 'fs';
import { connect } from 'mongoose';
import { Follow, LikedPost, SavedPost, Notification, Post, Comment, User, Reel, Message, findOne, findById, findByIdAndUpdate, findByUsername } from './models/user.model.js';
import pkg from 'body-parser';
const { json: _json } = pkg;
import token from 'jsonwebtoken';
const { sign, verify } = token;
import { uploadOnCloudinary } from './config/cloudinary.js';
import axios from 'axios';

import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// import userRoutes from './routes/userRoutes.js';


const router = Router();
app.use(json());
app.use(_json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/api', router);


// Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
const upload = multer({ storage });

// Connecting to database

const uri = process.env.MONGODB_URL;

connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Function - authenticate token

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

// Generate token

function generateToken(user) {
    return sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '24h', 
    });
}






// APIS

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, username, password } = req.body;

        const defaultProfileImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png';

        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            password,
            profileImage: defaultProfileImage, 
        });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Directly compare passwords (not recommended for production)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Send token in response
        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




// Settings

// Fetch user details
// app.get('/api/user', authenticateToken, async (req, res) => {
//     try {
//         const user = await findById(req.user.id, 'firstName lastName username email password location workCompany'); // Specify the fields you want to retrieve
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// Update user details
app.put('/api/user', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, location, workCompany, twitter, instagram, bio } = req.body;
  
        const updatedUser = await findByIdAndUpdate(
            req.user.id, 
            { firstName, lastName, email, username, password, location, workCompany, twitter, instagram, bio },
            { new: true }
        );
  
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  });


// Fetch user details
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        // Use the user ID from the token
        const user = await findById(req.user.id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Profile pic upload

app.post('/api/profile-upload', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        const localFilePath = req.file.path;
        const result = await uploadOnCloudinary(localFilePath);
        if (result) {
            const userId = req.user.id; 
            const user = await User.findById(userId);
            
            if (user) {
                user.profileImage = result.url; 
                await user.save();
                res.status(200).json({ url: result.url });
            } else {
                console.error('User not found');
                res.status(404).json({ error: 'User not found' });
            }
        } else {
            console.error('Failed to upload to Cloudinary');
            res.status(500).json({ error: 'Failed to upload to Cloudinary' });
        }
    } catch (error) {
        console.error('Server error:', error); // Log the error
        res.status(500).json({ error: error.message });
    }
});



// * new posts
app.get('/api/new-post', async (req, res) => {
    try {
        // Fetch all posts and populate the user field to get user details
        const posts = await Post.find()
            .populate('user', 'firstName lastName username profileImage')  // Populate user details
            .exec();

        // Send the posts data as a response
        res.status(200).json(posts);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});
// Notification function
const createNotification = async (user, type, entityId, message) => {
    try {
        const notification = new Notification({
            user,
            type,
            entityId,
            message,
        });
        await notification.save();
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find notifications for the user
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

        // Send the notifications as the response
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


app.post('/api/new-post', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const userId = req.user.id;
        const { caption, location, hashtags } = req.body;
        const file = req.file;

        // Upload image to Cloudinary
        let imageUrl = '';
        if (file) {
            const result = await uploadOnCloudinary(file.path);
            if (result) {
                imageUrl = result.url; // Use the Cloudinary URL
            } else {
                return res.status(500).json({ message: 'Failed to upload to Cloudinary' });
            }
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new post
        const newPost = new Post({
            caption,
            image: imageUrl, // Save the Cloudinary URL
            location,
            hashtags,
            user: userId, // Associate the post with the user
        });

        // Save the new post
        await newPost.save();

        // Create a notification for the user
        await createNotification(userId, 'post', newPost._id, 'Your post has been published!');

        // Send the new post as the response
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

// * Saved posts

// Backend: Saving a Post
// Backend: Check if a Post is Saved
app.get('/api/is-saved/:postId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from the token
        const { postId } = req.params;

        // Validate input
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        // Check if the post is saved by the user
        const savedPost = await SavedPost.findOne({ user: userId, post: postId });

        // Respond with the result
        res.status(200).json({ isSaved: !!savedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Like a post

// Check if a post is liked

app.get('/api/is-liked/:postId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from the token
        const { postId } = req.params;

        // Validate input
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        // Check if the post is saved by the user
        const likedPost = await LikedPost.findOne({ user: userId, post: postId });

        // Respond with the result
        res.status(200).json({ isLiked: !!likedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.post('/api/like-post', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from the token
        const { postId } = req.body;

        // Validate input
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the post is already saved by the user
        const existingSave = await LikedPost.findOne({ user: userId, post: postId });
        if (existingSave) {
            return res.status(400).json({ message: 'Post already saved' });
        }

        // Create a new saved post entry
        const newLikedPost = new LikedPost({
            user: userId,
            post: postId,
        });

        // Save the new saved post entry
        await newLikedPost.save();

        // Respond with the saved post data
        res.status(201).json(newLikedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.post('/api/unlike-post', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;

        // Validate input
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        // Check if the post is already liked by the user
        const likedPost = await LikedPost.findOne({ user: userId, post: postId });
        if (!likedPost) {
            return res.status(404).json({ message: 'Like not found' });
        }

        // Remove the liked post entry
        await LikedPost.deleteOne({ _id: likedPost._id });

        res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});


// Backend: Fetching liked Posts for a User
app.get('/api/liked-posts', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from the token

        // Fetch saved posts for the user and populate the post details
        const likedPost = await LikedPost.find({ user: userId })
            .populate('post')  // Populate post details
            .populate('user', 'firstName lastName username profileImage');

        // Send the saved posts data as a response
        res.status(200).json(likedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.get('/api/likes/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // Fetch likes for the specified post and populate user details
        const likedPosts = await LikedPost.find({ post: postId })
            .populate('user', 'firstName lastName username profileImage')  // Populate user details
            .exec();

        // Extract user details from likedPosts
        const usersWhoLiked = likedPosts.map(likedPost => likedPost.user);

        // Send the users who liked the post as a response
        res.status(200).json(usersWhoLiked);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});


// * Save feature

// Save a Post
app.post('/api/save-post', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from the token
        const { postId } = req.body;

        // Validate input
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the post is already saved by the user
        const existingSave = await SavedPost.findOne({ user: userId, post: postId });
        if (existingSave) {
            return res.status(400).json({ message: 'Post already saved' });
        }

        // Create a new saved post entry
        const newSavedPost = new SavedPost({
            user: userId,
            post: postId,
        });

        // Save the new saved post entry
        await newSavedPost.save();

        // Respond with the saved post data
        res.status(201).json(newSavedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Unsave a Post
app.post('/api/unsave-post', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from the token
        const { postId } = req.body;

        // Validate input
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        // Find and remove the saved post entry
        const deletedSavedPost = await SavedPost.findOneAndDelete({ user: userId, post: postId });

        if (!deletedSavedPost) {
            return res.status(404).json({ message: 'Saved post not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Post unsaved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});


// Backend: Fetching Saved Posts for a User
app.get('/api/saved-posts', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from the token

        // Fetch saved posts for the user and populate the post details
        const savedPosts = await SavedPost.find({ user: userId })
            .populate('post')  // Populate post details
            .populate('user', 'firstName lastName username profileImage');  // Populate user details if needed

        // Send the saved posts data as a response
        res.status(200).json(savedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});


// * Comment part

// Fetching comments
app.get('/api/comments/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // Fetch comments for the specified post and populate user details
        const comments = await Comment.find({ post: postId })
            .populate('user', 'firstName lastName username profileImage')  // Populate user details
            .exec();

        // Send the comments data as a response
        res.status(200).json(comments);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Adding comment
app.post('/api/new-comment', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const { postId, text } = req.body;

        // Validate input
        if (!postId || !text) {
            return res.status(400).json({ message: 'Post ID and comment text are required' });
        }

        // Find the user by ID to ensure the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the post to ensure it exists, and populate to get post owner's details
        const post = await Post.findById(postId).populate('user');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create a new comment
        const newComment = new Comment({
            text,
            user: userId,  // Associate the comment with the user
            post: postId,  // Associate the comment with the post
        });

        // Save the new comment
        await newComment.save();

        // Add the comment to the post's comments array
        post.comments.push(newComment._id);
        await post.save();

        // Create a notification for the post owner
        const message = `${user.username} left a comment on your post!`;
        await createNotification(post.user._id, 'comment', newComment._id, message);

        // Send the new comment as the response
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});


// * Reel part

// Fetching posts

app.get('/api/new-reel', async (req, res) => {
    try {
        const reels = await Reel.find()
            .populate('user', 'firstName lastName username profileImage')
            .exec();

        res.status(200).json(reels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Adding new reel
app.post('/api/new-reel', authenticateToken, upload.single('video'), async (req, res) => {
    try {
        const userId = req.user.id;
        const file = req.file;
        const { caption } = req.body; // Extract caption from the request body

        // Upload video to Cloudinary
        let videoUrl = '';
        if (file) {
            const result = await uploadOnCloudinary(file.path);
            if (result) {
                videoUrl = result.url; // Use the Cloudinary URL
            } else {
                return res.status(500).json({ message: 'Failed to upload to Cloudinary' });
            }
        }

        // Ensure the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new reel with the caption
        const newReel = new Reel({
            caption,         // Include the caption in the new reel
            video: videoUrl, // Save the Cloudinary URL
            user: userId,    // Associate the reel with the user
        });

        // Save the new reel
        await newReel.save();

        // Send the new reel as the response
        res.status(201).json(newReel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});




// User posts - for profile

app.get('/api/user-posts', authenticateToken, async (req, res) => {
    try {
        // Get the logged-in user's ID from the token
        const userId = req.user.id;

        // Fetch posts that belong to the logged-in user
        const posts = await Post.find({ user: userId })
            .populate('user', 'firstName lastName username profileImage')  // Populate user details
            .exec();

        // Send the user's posts data as a response
        res.status(200).json(posts);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});



const createDummyPost = async () => {
    try {
        // Create a dummy user first (assuming the user doesn't exist)
        const dummyUser = new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            username: 'johndoe',
            password: 'password123',
            location: 'New York',
            workCompany: 'Tech Inc.',
            profileImage: 'profile.jpg',
            bio: 'This is a dummy user.',
        });

        const savedUser = await dummyUser.save();

        // Now create a dummy post for the above user
        const dummyPost = new Post({
            user: savedUser._id,
            caption: 'This is a dummy post',
            image: 'dummy-image.jpg',
            location: 'New York',
            likes: 10,
        });

        const savedPost = await dummyPost.save();

        console.log('Dummy post saved:', savedPost);
    } catch (error) {
        console.error('Error creating dummy post:', error);
    }
};

// createDummyPost();


// * fetching posts for profile

app.get('/api/profile-posts', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the authenticated user's ID from the request

        // Fetch the user with their posts
        const user = await User.findById(userId)
            .select('firstName lastName username posts')
            .exec();

        if (!user || !user.posts.length) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        // Flatten the user's posts into an array
        const userPosts = user.posts.map(post => ({
            ...post.toObject(),
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username
            }
        }));

        // Send the user's posts as a response
        res.status(200).json(userPosts);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});




// * explore page
app.get('/api/all-users', authenticateToken, async (req, res) => {
    try {
        // Get the logged-in user's ID from the token
        const loggedInUserId = req.user.id;

        // Fetch all users except the logged-in user
        const users = await User.find(
            { _id: { $ne: loggedInUserId } },  // Exclude the logged-in user
            'profileImage username firstName lastName'
        );

        // Send the users data as a response
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});



// * profiles of other users
// app.get('/api/profile/:username', authenticateToken, async (req, res) => {
//     try {
//         const username = req.params.username;
//         const user = await findByUsername(username); 

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // If you don't want to expose sensitive fields like password, etc., exclude them from the response
//         const { password, ...publicData } = user._doc;

//         res.json(publicData);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

app.get('/api/profile/:username', authenticateToken, async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username }); // Find the user by username

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the follower and following counts
        const followerCount = await Follow.countDocuments({ following: user._id });
        const followingCount = await Follow.countDocuments({ follower: user._id });

        // Prepare the public data to send in the response
        const { password, ...publicData } = user._doc;

        // Include follower and following counts in the response
        res.json({
            ...publicData,
            followerCount,
            followingCount
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/profile-posts/:username', authenticateToken, async (req, res) => {
    try {
        const username = req.params.username; 

        // Find the user by username
        const user = await User.findOne({ username })
            .select('_id firstName lastName username')
            .exec();

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Find posts by the user's ID
        const userPosts = await Post.find({ user: user._id })
            .populate('user', 'firstName lastName username profileImage') // Populate user details
            .exec();

        if (!userPosts.length) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        // Send the posts with user details as a response
        res.status(200).json(userPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

// * buzz AI

app.post('/api/buzzai', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: message }
            ],
            max_tokens: 150,
        });

        const aiResponse = response.choices[0].message.content.trim();
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});


// * Follow feature
app.get('/api/get-logged-in-user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `authenticateToken` middleware sets `req.user`
        res.json({ userId });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user ID', error });
    }
});

app.post('/api/follow', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // The user who is following
        const { targetUserId } = req.body; // The user to be followed/unfollowed

        // Validate input
        if (!targetUserId) {
            return res.status(400).json({ message: 'Target user ID is required' });
        }

        // Check if the follow relationship already exists
        const existingFollow = await Follow.findOne({ follower: userId, following: targetUserId });

        if (existingFollow) {
            // If exists, unfollow (delete the follow relationship)
            await Follow.deleteOne({ _id: existingFollow._id });
            return res.status(200).json({ message: 'User unfollowed successfully' });
        } else {
            // If not exists, create a new follow relationship
            const newFollow = new Follow({ follower: userId, following: targetUserId });
            await newFollow.save();

            // Optional: Notify the target user that they have a new follower
            const followerUser = await User.findById(userId);
            const message = `${followerUser.username} started following you!`;
            await createNotification(targetUserId, 'follow', newFollow._id, message);

            return res.status(201).json({ message: 'User followed successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

app.get('/api/check-follow/:targetUserId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.params;

        const follow = await Follow.findOne({ follower: userId, following: targetUserId });

        if (follow) {
            return res.status(200).json({ isFollowing: true });
        } else {
            return res.status(200).json({ isFollowing: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

app.get('/api/following/:username', authenticateToken, async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { _id: userId } = user;

        // Find all users that the given user is following
        const followings = await Follow.find({ follower: userId }).populate('following', 'username profileImage');
        const followingUsers = followings.map(follow => follow.following);

        res.status(200).json(followingUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});


app.get('/api/followers/:username', authenticateToken, async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { _id: userId } = user;

        // Find all users who are following the given user
        const followers = await Follow.find({ following: userId }).populate('follower', 'username profileImage');
        const followerUsers = followers.map(follow => follow.follower);

        res.status(200).json(followerUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});




// * Message feature

// Sending a message
app.post('/api/messages', authenticateToken, async (req, res) => {
    const { senderId, receiverId, content } = req.body;
  
    try {
      // Find the sender by ID to get their username
      const sender = await User.findById(senderId);
      if (!sender) {
          return res.status(404).json({ message: 'Sender not found' });
      }

      // Find the receiver by ID to ensure they exist
      const receiver = await User.findById(receiverId);
      if (!receiver) {
          return res.status(404).json({ message: 'Receiver not found' });
      }

      // Create a new message
      const newMessage = new Message({
        senderId,
        receiverId,
        content,
      });
      await newMessage.save();

      // Create a notification for the recipient
      const message = `${sender.username} sent you a message!`;
      await createNotification(receiverId, 'message', newMessage._id, message);

      res.status(200).json(newMessage);
    } catch (err) {
      res.status(500).json({ error: 'Failed to send message' });
    }
});

  
  // Getting messages between two users
  app.get('/api/messages/:senderId/:receiverId', async (req, res) => {
    const { senderId, receiverId } = req.params;
  
    try {
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ timestamp: 1 }); // Sort by timestamp ascending
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  });
  

//   app.post('/api/like-post/:postId', authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { postId } = req.params;

//         const post = await Post.findById(postId);

//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

        
//         const likes = post.likes || [];

        
//         const hasLiked = likes.includes(userId);

//         if (hasLiked) {
            
//             post.likes = likes.filter(id => id.toString() !== userId.toString());
//         } else {
            
//             post.likes.push(userId);
//         }

//         await post.save();
//         res.status(200).json({ message: 'Post like status updated', likes: post.likes.length });

//     } catch (error) {
//         console.error('Error updating like status:', error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// });




app.get('/buzz', (req, res) => {
    res.send('Hello buzz buzz buzz!')
})


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})

export default router;