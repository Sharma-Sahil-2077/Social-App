import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import axios from 'axios';

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://192.168.29.31:4000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!newPostText) return;
    try {
      await axios.post('http://192.168.29.31:4000/api/posts', { text: newPostText }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNewPostText('');
      fetchPosts();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://192.168.29.31:4000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchPosts();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleComment = (postId) => {
    console.log('Open comments for post:', postId);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.createPost}>
        <TextInput
          style={styles.input}
          value={newPostText}
          onChangeText={setNewPostText}
          placeholder="What's on your mind?"
        />
        <TouchableOpacity style={styles.button} onPress={createPost}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCard post={item} onLike={handleLike} onComment={handleComment} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  createPost: { marginBottom: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 8 },
  button: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
