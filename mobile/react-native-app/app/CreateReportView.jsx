import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, ScrollView, Modal, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { handleUser } from '../api/user_api';
import { launchImageLibrary } from 'react-native-image-picker';

const { height } = Dimensions.get('window');


const CreateReportView = ({ onClose }) => {
  // user state
  const [user, setUser] = useState(null);

  // map nonsense
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
  const [image, setImage] = useState(null);

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

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setImage(response.assets[0]);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Report</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      {/* pop up */}
      <Modal
        visible={popupVisible}
        transparent
        animationType="fade" //fffffade that
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            {/* choose from existing item */}
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

            {/* case with new item */}
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

                    newItem = await handleUser('/addItemByUser/', {
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

            {/* show list of existing item */}
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
                        console.log("buddd", item.description);
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
          placeholderTextColor="#CCC"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.descriptionInput}
          placeholder="Lost Item Description"
          placeholderTextColor="#CCC"
          value={lostItemDescription}
          onChangeText={setLostItemDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Bounty (Optional)"
          placeholderTextColor="#CCC"
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
          >
            <Picker.Item label="Public" value="Public" />
            <Picker.Item label="Friends Only" value="Friends" />
            <Picker.Item label="Only Me" value="Private" />
          </Picker>
        </View>

        {/* image picking */}
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>
            {image ? 'Change Image' : 'Add Image'}
          </Text>
        </TouchableOpacity>
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 8,
              marginTop: 10,
            }}
          />
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            handleUser(
              '/createLostReport/',
              {
                user_id: user.id,
                item_id: selectedItemId ?? 0, // use chosen ID if exists
                name,
                longitude,
                latitude,
                radius,
                description: lostItemDescription,
                bounty: itemBounty,
                image: image ? image.uri : null,
              },
              'POST'
            );
          }}
        >
          <Text style={styles.saveButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C2C2C' },
  header: {
    backgroundColor: '#DDD',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'center' },
  closeButton: { position: 'absolute', right: 16, top: 16 },
  closeButtonText: { fontSize: 16, color: '#333' },
  content: { padding: 16 },
  map: { height: height * 0.3, borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  input: { backgroundColor: '#444', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 16 },
  descriptionInput: {
    backgroundColor: '#444',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sliderContainer: { marginBottom: 16 },
  sliderLabel: { color: '#FFF', marginBottom: 8 },
  slider: { width: '100%' },
  dropdownContainer: { marginBottom: 16 },
  dropdownLabel: { color: '#FFF', marginBottom: 8 },
  dropdown: { backgroundColor: '#444', color: '#FFF', borderRadius: 8 },
  saveButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  // Alert styles
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  alertBox: { width: '85%', backgroundColor: '#FFF', borderRadius: 12, padding: 20, elevation: 6 },
  alertTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center', color: '#333', marginBottom: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  alertButton: { flex: 1, paddingVertical: 10, borderRadius: 8, marginHorizontal: 5 },
  alertButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  alertInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#000',
  },
  imageButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  imageButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default CreateReportView;
