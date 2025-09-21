import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { handleUser } from '../api/user_api';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from "expo-location";

const { height } = Dimensions.get('window');

const CreateFoundReportView = ({ onClose, location }) => {
  // user state
  const [user, setUser] = useState(null);

  // map state
  const [marker, setMarker] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [radius, setRadius] = useState(50);

  // report state
  const [name, setName] = useState('');
  const [foundItemDescription, setFoundItemDescription] = useState('');

  // image state
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await handleUser('/profile/', {}, 'GET');
      setUser(userData);
    };
    fetchUser();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onClose} style={styles.headerCancelButton}>
          <Text style={styles.headerCancelText}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Found Report</Text>
        </View>
        <View style={{ width: 72 }} />
      </View>

      {/* Main Form */}
      <ScrollView contentContainerStyle={styles.content}>
        {location ? (
          <MapView
            showsUserLocation={true}
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => {
              setMarker(e.nativeEvent.coordinate);
              setLatitude(e.nativeEvent.coordinate.latitude);
              setLongitude(e.nativeEvent.coordinate.longitude);
            }}
          >
            {marker && (
              <>
                <Marker coordinate={marker} />
                <Circle center={marker} radius={radius} />
              </>
            )}
          </MapView>
        ) : (
          <View style={[styles.map, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#FFF' }}>Fetching location...</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Found Item Name"
          placeholderTextColor="#AAAAAA"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.descriptionInput}
          placeholder="Found Item Description"
          placeholderTextColor="#AAAAAA"
          value={foundItemDescription}
          onChangeText={setFoundItemDescription}
          multiline
        />

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Radius: {radius} meters</Text>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={500}
            step={10}
            value={radius}
            onValueChange={setRadius}
            minimumTrackTintColor="#FFF"
            maximumTrackTintColor="#888"
          />
        </View>

        <TouchableOpacity style={styles.addImageDashed} onPress={pickImage}>
          <FontAwesome name="image" size={36} color="#0096FF" />
          <Text style={styles.addImageDashedText}>
            {images.length > 0 ? 'Add More Photos/Video' : 'Add Photos/Video'}
          </Text>
        </TouchableOpacity>

        <ScrollView horizontal
          style={styles.previewContainer}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsHorizontalScrollIndicator={false}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.thumbnailWrapper}>
              <Image source={{ uri }} style={styles.thumbnail} />
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={async () => {
            console.log({
              founder_id: Number(user.user_id),
              item_id: null,
              title: String(name),
              description: String(foundItemDescription),
              longitude: parseFloat(longitude),
              latitude: parseFloat(latitude),
              radius: parseFloat(radius),
            });
            await handleUser('/createFoundReport/', {
              founder_id: Number(user.user_id),
              item_id: null,
              title: String(name),
              description: String(foundItemDescription),
              longitude: parseFloat(longitude),
              latitude: parseFloat(latitude),
              radius: parseFloat(radius),
            }, 'POST');
            for (let i = 0; i < images.length; i++) {
              await handleUser('/addImage/', {
                // If your backend expects a found_item_id, modify as needed
                url: images[i],
                faiss_id: null,
              }, 'POST')
            }
            onClose();
          }}
        >
          <Text style={styles.saveButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#363636',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222',
  },
  headerCancelButton: { paddingHorizontal: 20, zIndex: 2 },
  headerCancelText: { color: '#FFF', fontSize: 18, fontWeight: '400' },
  headerTitleContainer: { flex: 1, alignItems: 'center', marginRight: 24 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  content: { padding: 18, paddingBottom: 60 },
  map: { height: height * 0.24, borderRadius: 10, marginBottom: 16, overflow: 'hidden' },
  input: {
    backgroundColor: '#232323',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#303030',
    fontSize: 16,
  },
  descriptionInput: {
    backgroundColor: '#232323',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#303030',
    fontSize: 16,
  },
  sliderContainer: { marginBottom: 16 },
  sliderLabel: { color: '#DDD', marginBottom: 6, fontWeight: '500' },
  slider: { width: '100%' },
  addImageDashed: {
    borderWidth: 2,
    borderColor: '#0096FF',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
    backgroundColor: '#1a1a1a',
    width: '100%',
  },
  addImageDashedText: {
    color: '#0096FF',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 17,
  },
  previewContainer: { marginTop: 4 },
  thumbnailWrapper: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#121212'
  },
  thumbnail: {
    width: 92,
    height: 92,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#0096FF', 
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 40,
    opacity: 1
  },
  saveButtonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});

export default CreateFoundReportView;
