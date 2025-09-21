import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { handleUser } from '../api/user_api';

const { height } = Dimensions.get('window');

export default function SubmitClaimScreen() {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bounty, setBounty] = useState('');
  const [images, setImages] = useState([]);

  // Image picker handler
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris]);
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!title || !description) {
      alert('Please fill in both title and description.');
      return;
    }

    const bountyValue = bounty.trim() === '' ? 0 : parseFloat(bounty);

    try {
      // Example API call for submitting claim info
      const response = await handleUser('/submitClaim/', {
        title,
        description,
        bounty: bountyValue,
        // Possibly send images URLs or handle uploads separately
      }, 'POST');

      // You can handle success feedback or navigation here
      alert('Claim submitted successfully!');
      resetForm();

    } catch (error) {
      alert('Error submitting claim. Please try again.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBounty('');
    setImages([]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter claim title"
          placeholderTextColor="#AAA"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter detailed description"
          placeholderTextColor="#AAA"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Optional Reward Bounty</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter bounty amount"
          placeholderTextColor="#AAA"
          value={bounty}
          onChangeText={setBounty}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
          <FontAwesome name="image" size={36} color="#0096FF" />
          <Text style={styles.addImageText}>
            {images.length > 0 ? 'Add More Photos' : 'Add Photos'}
          </Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          style={styles.imagePreviewContainer}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsHorizontalScrollIndicator={false}
        >
          {images.map((uri, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.imageThumbnail} />
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Claim</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    color: '#DDD',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#232323',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#303030',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: '#0096FF',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginBottom: 20,
  },
  addImageText: {
    color: '#0096FF',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 17,
  },
  imagePreviewContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#121212',
  },
  imageThumbnail: {
    width: 92,
    height: 92,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#0096FF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  }
});
