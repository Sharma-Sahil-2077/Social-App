import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import PostCard from '../components/PostCard';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/user/${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
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

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}`, { username, bio }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setUpdating(false);
    }
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
      <View style={styles.profileCard}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />

        <Text style={styles.label}>Bio</Text>
        <TextInput style={styles.input} value={bio} onChangeText={setBio} />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={updating}>
          <Text style={styles.buttonText}>{updating ? 'Updating...' : 'Update Profile'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard post={item} onLike={() => {}} onComment={() => {}} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No posts yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  profileCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 16, elevation: 3 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  label: { color: '#555', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
  updateButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, marginBottom: 8, alignItems: 'center' },
  logoutButton: { backgroundColor: '#dc3545', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#555', marginTop: 20 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
