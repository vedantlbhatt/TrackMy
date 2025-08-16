import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import CreateReportView from './CreateReportView';

const places = [
  {
    id: '1',
    title: 'Coffee Shop',
    description: 'Best coffee in town!',
    coordinate: { latitude: 37.78825, longitude: -122.4324 },
    image: 'https://placekitten.com/300/200'
  },
  {
    id: '2',
    title: 'Park',
    description: 'Lovely green park for walks',
    coordinate: { latitude: 37.78925, longitude: -122.4354 },
    image: 'https://placekitten.com/301/201'
  }
];

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const modalRef = useRef(null);
  const navigation = useNavigation();

  const onMarkerPress = (place) => {
    setSelectedPlace(place);
    modalRef.current?.open();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={place.coordinate}
            title={place.title}
            onPress={() => onMarkerPress(place)}
          >
            <Callout>
              <Text>{place.title}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <CreateReportView onClose={() => setModalVisible(false)} />
        </View>
      </Modal>

      <Modalize
        ref={modalRef}
        alwaysOpen={Dimensions.get('window').height * 0.25}
        modalHeight={Dimensions.get('window').height * 0.9}x
        adjustToContentHeight={false}
        withHandle
      >
        {selectedPlace ? (
          <View style={styles.modalContent}>
            <Text style={styles.title}>{selectedPlace.title}</Text>
            <Image
              source={{ uri: selectedPlace.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.description}>{selectedPlace.description}</Text>
          </View>
        ) : (
          <Text style={styles.noSelection}>Select a place on the map</Text>
        )}
      </Modalize>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#333', // match CreateReportView theme
  },
  modalContent: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: Dimensions.get('window').width - 32,
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  noSelection: {
    padding: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 2,
  },
});
