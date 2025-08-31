import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, ScrollView, Modal, Image, Icon } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { handleUser } from '../api/user_api';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';


const { height } = Dimensions.get('window');

const CreateReportView = ({ onClose }) => {

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

  // user state
  const [user, setUser] = useState(null);

  // map state
  const [marker, setMarker] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [radius, setRadius] = useState(50);

  // report state
  const [name, setName] = useState('');
  const [lostItemDescription, setLostItemDescription] = useState('');
  const [itemBounty, setItemBounty] = useState('');
  const [visibility, setVisibility] = useState('Public');

  // popup state
  const [popupVisible, setPopupVisible] = useState(true);
  const [showNewItemFields, setShowNewItemFields] = useState(false);

  // new vs existing item
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [existingItem, setExistingItem] = useState(false);
  const [items, setItems] = useState([]); // list of existing items
  const [selectedItemId, setSelectedItemId] = useState(null); // ID of chosen selected item

  // image state
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await handleUser('/profile/', {}, 'GET');
      setUser(userData);
    };
    fetchUser();
  }, []);

  const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onClose} style={styles.headerCancelButton}>
          <Text style={styles.headerCancelText}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Create Report</Text>
        </View>
        <View style={{ width: 72 }} /> 

      </View>

      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            {!existingItem && !showNewItemFields && (
              <>
                <Text style={styles.alertTitle}>Choose from stored items?</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.alertButton, { backgroundColor: '#1E90FF' }]}
                    onPress={async () => {
                      setExistingItem(true);
                      const data = await handleUser('/getItemsByUser/', { user_id: user.user_id }, 'GET');
                      const list = data || [];
                      setItems(list);
                    }}
                  >
                    <Text style={styles.alertButtonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.alertButton, { backgroundColor: '#FF5722' }]}
                    onPress={() => {
                      setShowNewItemFields(true);
                      setExistingItem(false);
                    }}
                  >
                    <Text style={styles.alertButtonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {showNewItemFields && (
              <>
                <Text style={styles.alertTitle}>Add a New Item</Text>
                <TextInput
                  style={styles.alertInput}
                  placeholder="Item Name"
                  placeholderTextColor="#888"
                  value={newItemName}
                  onChangeText={setNewItemName}
                />
                <TextInput
                  style={[
                    styles.alertInput,
                    { height: 80, textAlignVertical: 'top' },
                  ]}
                  placeholder="Description of item"
                  placeholderTextColor="#888"
                  multiline
                  value={newItemDesc}
                  onChangeText={setNewItemDesc}
                />
                <TouchableOpacity
                  style={[
                    styles.alertButton,
                    { backgroundColor: '#1E90FF', marginTop: 10 },
                  ]}
                  onPress={async () => {
                    const newItem = await handleUser('/addItemByUser/', {
                      user_id: user.user_id,
                      name: newItemName,
                      description: newItemDesc,
                    }, 'POST');
                    setSelectedItemId(newItem.item_id);
                    setLostItemDescription(newItemDesc);
                    setName(newItemName);
                    setPopupVisible(false);
                  }}
                >
                  <Text style={styles.alertButtonText}>Continue</Text>
                </TouchableOpacity>
              </>
            )}

            {existingItem && items.length > 0 && (
              <>
                <Text style={styles.alertTitle}>Select an Item</Text>
                <ScrollView style={{ maxHeight: 200 }}>
                  {items.map((item) => (
                    <TouchableOpacity
                      key={item.id || item.item_id}
                      style={{
                        padding: 10,
                        marginVertical: 5,
                        borderRadius: 8,
                        backgroundColor: '#eee',
                      }}
                      onPress={() => {
                        setSelectedItemId(item.item_id);
                        setLostItemDescription(item.description);
                        setName(item.name);
                        setPopupVisible(false);
                      }}
                    >
                      <Text style={{ fontSize: 16, color: '#333' }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        <MapView
          style={styles.map}
          initialRegion={region}
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

        <TextInput
          style={styles.input}
          placeholder="Lost Item Name"
          placeholderTextColor="#AAAAAA"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.descriptionInput}
          placeholder="Lost Item Description"
          placeholderTextColor="#AAAAAA"
          value={lostItemDescription}
          onChangeText={setLostItemDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Bounty (Optional)"
          placeholderTextColor="#AAAAAA"
          value={itemBounty}
          onChangeText={setItemBounty}
          keyboardType="numeric"
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

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Who can view:</Text>
          <Picker
            selectedValue={visibility}
            style={styles.dropdown}
            onValueChange={(itemValue) => setVisibility(itemValue)}
            dropdownIconColor="#FFF"
          >
            <Picker.Item label="Public" value="Public" />
            <Picker.Item label="Friends Only" value="Friends" />
            <Picker.Item label="Only Me" value="Private" />
          </Picker>
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
            itemBounty == null ? setItemBounty(0) : itemBounty;
            await handleUser('/createLostReport/', {
              user_id: Number(user.user_id),
              item_id: Number(selectedItemId),
              title: String(name),
              description: String(lostItemDescription),
              longitude: parseFloat(longitude),
              latitude: parseFloat(latitude),
              radius: parseFloat(radius),
              bounty: parseFloat(itemBounty),
            }, 'POST');
            for (let i = 0; i < images.length; i++) {
              console.log("uri:",
                images[i])
              await handleUser('/addImage/', {
                item_id: selectedItemId,
                url: images[i],
                faiss_id: null,
              }, 'POST')
            }
            onClose()
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
  headerCancelText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '400'
  },
  headerTitleContainer: { 
    flex: 1, 
    alignItems: 'center',
    marginRight: 24
   },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center'
  },


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

  dropdownContainer: { marginBottom: 18 },
  dropdownLabel: { color: '#DDD', marginBottom: 7, fontWeight: '500' },
  dropdown: {
    backgroundColor: '#232323',
    color: '#fff',
    borderRadius: 10,
    padding: 0,
    borderColor: '#303030',
    borderWidth: 1,
  },


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
  addImageIcon: {
    width: 36,
    height: 36,
    tintColor: '#0096FF',
    resizeMode: 'contain',
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

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.62)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertBox: {
    width: '87%',
    backgroundColor: '#222',
    borderRadius: 14,
    padding: 22,
    elevation: 10
  },
  alertTitle: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFF',
    marginBottom: 15
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  alertButton: { flex: 1, paddingVertical: 12, borderRadius: 8, marginHorizontal: 7 },
  alertButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 17 },
  alertInput: {
    backgroundColor: '#191919',
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
    color: '#fff'
  },
});

export default CreateReportView;
