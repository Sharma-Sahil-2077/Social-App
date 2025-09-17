import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PostCard({ post, onLike, onComment }) {
  const isLiked = post.likes?.includes(post.user._id); // adjust based on your data

  return (
    <View style={styles.card}>
      <Text style={styles.username}>{post.user.username}</Text>
      <Text style={styles.text}>{post.text}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onLike(post._id)}>
          <Text style={[styles.actionText, isLiked ? styles.liked : null]}>
            {isLiked ? 'Liked' : 'Like'} ({post.likes?.length || 0})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onComment(post._id)}>
          <Text style={styles.actionText}>
            Comments ({post.comments?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    color: '#333',
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionText: {
    fontWeight: '600',
    color: '#555',
  },
  liked: {
    color: '#007bff',
  },
});
