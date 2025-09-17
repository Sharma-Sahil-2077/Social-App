import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function PostCard({ post, onLike, onDelete }) {
  const { user } = useContext(AuthContext);

  const [menuVisible, setMenuVisible] = useState(false);
  const [likes, setLikes] = useState([]);
  const [likesVisible, setLikesVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  const [editingPost, setEditingPost] = useState(false);
  const [editPostText, setEditPostText] = useState(post.text);

  const isLiked = post.likes?.includes(user?._id);

  // -------------------- Likes --------------------
  const fetchLikes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://ab-delta-six.vercel.app/api/posts/${post._id}/likes`, {
        headers: { token: user.token },
      });
      setLikes(res.data);
      setLikesVisible(true);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await axios.get(`https://ab-delta-six.vercel.app/api/posts/${post._id}/comments`, {
        headers: { token: user.token },
      });
      setComments(res.data.comments || res.data);
      setCommentsVisible(true);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `https://ab-delta-six.vercel.app/api/posts/${post._id}/comment`,
        { text: newComment },
        { headers: { token: user.token } }
      );
      setComments(prev => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.text);
  };

  const saveCommentEdit = async () => {
    try {
      const res = await axios.put(
        `https://ab-delta-six.vercel.app/api/posts/${post._id}/comments/${editingCommentId}`,
        { text: editCommentText },
        { headers: { token: user.token } }
      );
 setComments(prev =>
      prev.map(c => (c._id === editingCommentId ? res.data : c))
    );      setEditingCommentId(null);
      setEditCommentText('');
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `https://ab-delta-six.vercel.app/api/posts/${post._id}/comments/${commentId}`,
        { headers: { token: user.token } }
      );
      setComments(res.data.comments || res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // -------------------- Edit Post --------------------
  const savePostEdit = async () => {
    try {
      const res = await axios.put(
        `https://ab-delta-six.vercel.app/api/posts/${post._id}`,
        { text: editPostText },
        { headers: { token: user.token } }
      );
      post.text = res.data.text; // update local post object
      setEditingPost(false);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image style={styles.avatar} source={{ uri: 'https://i.pravatar.cc/40' }} />
        <Text style={styles.username}>{post.userId.username}</Text>
        {post.userId._id === user._id && (
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(!menuVisible)}>
            <Text style={{fontSize:30 , justifyContent:'center',}}>⋮</Text>
          </TouchableOpacity>
        )}
      </View>

      {menuVisible && editingPost === false && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => setEditingPost(true)}>
            <Text style={styles.menuItem}>Edit Post</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(post._id)}>
            <Text style={styles.menuItem}>Delete Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {editingPost ? (
        <View style={{ flexDirection: 'row', marginVertical: 8 }}>
          <TextInput
            style={styles.editInput}
            value={editPostText}
            onChangeText={setEditPostText}
          />
          <TouchableOpacity onPress={savePostEdit} style={styles.saveBtn}>
            <Text style={{ color: '#fff' }}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.text}>{post.text}</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onLike(post._id)}>
          <Text style={{ color: isLiked ? '#007bff' : '#555' }}>
            {isLiked ? 'Liked' : 'Like'} ({post.likes?.length || 0})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={fetchComments}>
          <Text style={{ color: '#555' }}>Comments ({post.comments?.length || 0})</Text>
        </TouchableOpacity>
      </View>

      {/* COMMENTS MODAL */}
      <Modal transparent visible={commentsVisible} animationType="slide" onRequestClose={() => setCommentsVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Comments</Text>
            {loadingComments ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <FlatList
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.commentItem}>
                    <Text style={styles.commentUser}>{item.userId.username}</Text>

                    {editingCommentId === item._id ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                          style={styles.editInput}
                          value={editCommentText}
                          onChangeText={setEditCommentText}
                        />
                        <TouchableOpacity onPress={saveCommentEdit} style={styles.saveBtn}>
                          <Text style={{ color: '#fff' }}>Save</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={styles.commentText}>{item.text}</Text>
                    )}

                    {item.userId._id === user._id && editingCommentId !== item._id && (
                      <View style={styles.commentActions}>
                        <TouchableOpacity onPress={() => startEditingComment(item)}>
                          <Text style={styles.editBtn}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteComment(item._id)}>
                          <Text style={styles.deleteBtn}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No comments yet</Text>}
              />
            )}

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity onPress={addComment} style={styles.sendBtn}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setCommentsVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 3 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 30, height: 30, borderRadius: 5, marginRight: 8 },
  username: { fontWeight: 'bold', fontSize: 16 },
  menuBtn: { marginLeft: 'auto',height:30, width:30,justifyContent:'center', alignItems:'center' ,borderRadius:10 },
  menu: { position: 'absolute', top: 35,  right: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, zIndex: 100, elevation: 5 },
  menuItem: { padding: 10 },
  text: { color: '#333', marginVertical: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  popup: { backgroundColor: '#fff', padding: 16, borderRadius: 10, width: '90%', maxHeight: '80%' },
  popupTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  commentItem: { marginBottom: 10, borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 5 },
  commentUser: { fontWeight: 'bold' },
  commentText: { color: '#333', marginVertical: 4 },
  commentActions: { flexDirection: 'row', marginTop: 4 },
  editBtn: { color: 'blue', marginRight: 10 },
  deleteBtn: { color: 'red' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  commentInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8 },
  sendBtn: { marginLeft: 10, backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
  sendText: { color: '#fff', fontWeight: '600' },
  closeBtn: { marginTop: 10, backgroundColor: '#ccc', padding: 10, borderRadius: 5, alignItems: 'center' },
  closeText: { color: '#000' },
  editInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 5 },
  saveBtn: { marginLeft: 8, padding: 8, backgroundColor: '#007bff', borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: '#777', marginTop: 20 },
});
