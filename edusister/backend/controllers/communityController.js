const { db, admin } = require('../config/firebaseAdmin');

// POST /api/admin/community/posts
const createCommunityPost = async (req, res) => {
  try {
    const {
      content,
      createdBy,
      authorName,
      tags = [],
      anonymous = false,
    } = req.body;

    if (!content || !createdBy) {
      return res.status(400).json({ message: 'Missing content or createdBy' });
    }

    const newPost = {
      content,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: anonymous ? 'anonymous' : createdBy,
      authorName: anonymous ? null : authorName || null,
      tags,
      likes: 0,
      reports: 0,
    };

    const docRef = await db.collection('communityPosts').add(newPost);
    res.status(201).json({ message: 'Post created', id: docRef.id });
  } catch (err) {
    console.error('🔥 Error creating community post:', err);
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

// POST /api/admin/community/posts/:postId/comments
const addCommentToCommunityPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const {
      comment,
      authorId,
      authorName,
      authorPhoto = null,
      authorRole = null,
      anonymous = false,
    } = req.body;

    const trimmedComment = comment?.trim();

    if (!trimmedComment || !authorId) {
      return res.status(400).json({ message: 'Missing or invalid comment or authorId' });
    }

    const hashtags = trimmedComment.match(/#\w+/g)?.map(tag => tag.slice(1).toLowerCase()) || [];

    const commentData = {
      comment: trimmedComment,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      authorId: anonymous ? 'anonymous' : authorId,
      authorName: anonymous ? null : authorName || null,
      authorPhoto: anonymous ? null : authorPhoto || null,
      authorRole: anonymous ? null : authorRole || null,
      hashtags,
    };

    await db
      .collection('communityPosts')
      .doc(postId)
      .collection('comments')
      .add(commentData);

    return res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error('🔥 Error adding comment:', {
      message: err.message,
      stack: err.stack,
      postId: req.params.postId,
      user: req.body.authorId,
    });
    return res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

module.exports={
    createCommunityPost,
    addCommentToCommunityPost
};