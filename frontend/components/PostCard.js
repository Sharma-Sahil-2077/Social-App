import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function PostCard({ post, onLike, onComment, onDelete }) {
  const { user } = useContext(AuthContext); 
  const [menuVisible, setMenuVisible] = useState(false);

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likesVisible, setLikesVisible] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  const isLiked = post.likes?.includes(user?._id);

  // fetch likes
  const fetchLikes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://192.168.29.31:4000/api/posts/${post._id}/likes`, {
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

  // fetch comments
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await axios.get(`http://192.168.29.31:4000/api/posts/${post._id}/comments`, {
        headers: { token: user.token },
      });
      setComments(res.data);
      setCommentsVisible(true);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  // add comment
  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://192.168.29.31:4000/api/posts/${post._id}/comment`,
        { text: newComment },
        { headers: { token: user.token } }
      );
      setComments(res.data);
      setNewComment('');
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // start editing
  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  // save edit
  const saveEdit = async () => {
    try {
      await axios.put(
        `http://192.168.29.31:4000/api/posts/${post._id}/comments/${editingComment}`,
        { text: editText },
        { headers: { token: user.token } }
      );
      setComments((prev) =>
        prev.map((c) =>
          c._id === editingComment ? { ...c, text: editText } : c
        )
      );
      setEditingComment(null);
      setEditText('');
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // delete comment
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://192.168.29.31:4000/api/posts/${post._id}/comments/${commentId}`,
        { headers: { token: user.token } }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', marginBottom: 8 }}>
        <Image
          style={{ height: 30, width: 30, borderRadius: 5, marginRight: 8 }}
          source={{ uri: 'https://i.pravatar.cc/40' }}
        />
        <Text style={styles.username}>{post.userId.username}</Text>

        <View style={styles.right}>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Text style={styles.menuButton}>⋮</Text>
          </TouchableOpacity>
          {menuVisible && (
            <View style={styles.menu}>
              <TouchableOpacity onPress={() => { setMenuVisible(false); onDelete(post._id); }}>
                <Text style={styles.menuItem}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Post text */}
      <Text style={styles.text}>{post.text}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Like */}
        <TouchableOpacity onPress={() => onLike(post._id)}>
          <Text style={[styles.actionText, { color: isLiked ? '#007bff' : '#555' }]}>
            {isLiked ? 'Liked ' : 'Like'}{' '}
            <Text onPress={fetchLikes} style={{ color: 'black' }}>
              ({post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'})
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Comments */}
        <TouchableOpacity onPress={fetchComments}>
          <Text style={styles.actionText}>
            Comments ({post.comments?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Likes Modal */}
      <Modal transparent visible={likesVisible} animationType="fade" onRequestClose={() => setLikesVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Likes</Text>
            {loading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <FlatList
                data={likes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <Text style={styles.userItem}>{item.username}</Text>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No likes yet</Text>}
              />
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setLikesVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal transparent visible={commentsVisible} animationType="slide" onRequestClose={() => setCommentsVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Comments</Text>
            {loadingComments ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <FlatList
                style={styles.list}
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.commentItem}>
                    <Text style={styles.commentUser}>{item.userId.username}</Text>

                    {editingComment === item._id ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                          style={styles.editInput}
                          value={editText}
                          onChangeText={setEditText}
                        />
                        <TouchableOpacity onPress={saveEdit}>
                          <Text style={styles.saveBtn}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setEditingComment(null)}>
                          <Text style={{ color: 'gray', marginLeft: 8 }}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={styles.commentText}>{item.text}</Text>
                    )}

                    {item.userId._id === user._id && editingComment !== item._id && (
                      <View style={styles.commentActions}>
                        <TouchableOpacity onPress={() => startEditing(item)}>
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

            {/* Add new comment */}
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

            <TouchableOpacity style={styles.closeBtn} onPress={() => setCommentsVisible(false)}>
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
  username: { fontWeight: 'bold', fontSize: 16 },
  text: { color: '#333', marginVertical: 8 },
  right: { position: 'absolute', right: 0 },
  menuButton: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 8 },
  menu: { position: 'absolute', top: 30, right: 0, backgroundColor: '#fff', width: 100, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, elevation: 5 },
  menuItem: { padding: 10, fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
  actionText: { fontWeight: '600', color: '#555' },
  liked: { color: '#007bff' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  popup: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' },
  popupTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  userItem: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  empty: { textAlign: 'center', color: '#555', marginTop: 20 },
  closeBtn: { marginTop: 10, backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center' },
  closeText: { color: '#fff' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  commentInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8 },
  sendBtn: { marginLeft: 10, backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
  sendText: { color: '#fff', fontWeight: '600' },
  commentItem: { marginBottom: 10, borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 5 },
  commentUser: { fontWeight: 'bold' },
  commentText: { color: '#333', marginVertical: 4 },
  commentActions: { flexDirection: 'row', marginTop: 4 },
  editBtn: { color: 'blue', marginRight: 10 },
  deleteBtn: { color: 'red' },
  editInput: { borderWidth: 1, borderColor: '#ccc', flex: 1, padding: 5, marginRight: 5 },
  saveBtn: { color: 'green', marginLeft: 8 },
});
