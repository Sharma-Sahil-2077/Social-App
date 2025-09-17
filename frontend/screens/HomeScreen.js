import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation(); 
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tk = user.token;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://ab-delta-six.vercel.app/api/posts', {
        headers: { token: tk },
      });
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
      await axios.post(
        'https://ab-delta-six.vercel.app/api/posts',
        { text: newPostText },
        { headers: { token: tk } }
      );
      setNewPostText('');
      fetchPosts();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `https://ab-delta-six.vercel.app/api/posts/${postId}/like`,
        {},
        { headers: { token: tk } }
      );
      fetchPosts(); // refresh posts to update like count
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `https://ab-delta-six.vercel.app/api/posts/${postId}`,
        
        { headers: { token: tk } }
      );
      fetchPosts(); // refresh posts to update like count
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  const handleComment = (postId) => {
    console.log('Open comments for post:', postId);
  };

  
  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
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
      
      
        <View style ={{ height:'10%', width:'100%', marginBottom:5, justifyContent: 'space-between', flexDirection:'row', gap:10, marginTop:'8%' ,}}>
          <TouchableOpacity
              style={{ padding: 10, font:'black', fontWeight:20, borderRadius: 5, }}
            >
              <Text style={{ color: 'slate-600',height:'100%', fontSize:50, fontWeight:'light' }}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity  
              onPress={() => navigation.navigate('Profile')}
              style={{ padding: 10, justifyContent:'center', height:'60%', backgroundColor: '#007bff', borderRadius: 10 , width:'auto', }}
            >
              <Text style={{ color: '#fff' }}>Profile</Text>
            </TouchableOpacity>
          </View>

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
          <PostCard post={item} onLike={handleLike} onComment={handleComment} onDelete={handleDeletePost}  />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' , },
  createPost: { marginBottom: 16 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
