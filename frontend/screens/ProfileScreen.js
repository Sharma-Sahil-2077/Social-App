import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function ProfileScreen() {
  const { user, setUser, logout } = useContext(AuthContext); // include setUser
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const tk = user?.token;

  // Verify user / token on entering screen
  useEffect(() => {
    const verifyUser = async () => {
      if (!tk) {
        logout();
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get('http://192.168.29.31:4000/api/users/me', {
          headers: { token: tk },
        });
        setUser({ ...user, ...res.data }); // update context user
        setUsername(res.data.username);
        setBio(res.data.bio || '');
      } catch (err) {
        console.log('Token verification failed or user not found:', err.response?.data || err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await axios.put(
        'http://192.168.29.31:4000/api/users/me',
        { username, bio },
        { headers: { token: tk } }
      );
      setUser({ ...user, ...res.data });
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
      <View style={{width:'100%', height:'40%', alignItems:'center' , justifyContent:'center',  backgroundColor:'#fff'}}>
          <Image
            style={{ height: '90%', width: '90%', borderRadius: 5, padding:'5%',borderRadius:10}}
            source={{ uri: 'https://picsum.photos/400' }}
          />

          <View>
          </View>
      </View>
      <View style={styles.profileCard}>
        {/* <Text style={styles.title}>Profile</Text> */}
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
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
