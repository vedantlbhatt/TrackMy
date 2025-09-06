import React, { useState, useRef, createContext,useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Modal, FlatList } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import CreateReportView from './CreateReportView';
import CreateFoundReportView from './CreateFoundReportView';
import { handleUser } from '../api/user_api';
import * as Location from "expo-location";
import Ionicons from 'react-native-vector-icons/Ionicons';



const ModalVisibilityContext = createContext();

export const ModalVisibilityProvider = ({ children }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  return (
    <ModalVisibilityContext.Provider value={{ popupVisible, setPopupVisible }}>
      {children}
    </ModalVisibilityContext.Provider>
  );
};

export const useModalVisibility = () => useContext(ModalVisibilityContext);
  
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
  const [lostReportModalVisible, setLostReportModalVisible] = useState(false);
  const [foundReportModalVisible, setFoundReportModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const modalRef = useRef(null);
  const navigation = useNavigation();

  const [reports, setReports] = useState([]);
  const [reportLocs, setReportLocs] = useState([]);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [showSelectedReport, setShowSelectedReport] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status != "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      } 
      // Get initial location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      // Start watching location
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5, 
        },
        (loc) => {
          setLocation(loc.coords); // update state with new coords
        }
      );
  
      return () => subscription.remove(); // cleanup on unmount
    })();
  }, []);
  

  useEffect(() => {
    const fetchReports = async () => {
      if (!selectedReport) {
        const data = await handleUser('/getAllLostReports/', {}, 'GET');
  
        if (Array.isArray(data)) {
          const titles = [];
          const coords = [];
  
          data.forEach((report) => {
            if (report.latitude != null && report.longitude != null) {
              coords.push({
                id: report.lost_report_id, 
                title: report.title,
                coordinate: {
                  latitude: parseFloat(report.latitude),
                  longitude: parseFloat(report.longitude),
                },
                description: report.description,
                bounty: report.bounty
              });
              titles.push(report.title);
            }
          });
  
          setReports(titles);
          setReportLocs(coords);
        }
      }
    };
  
    fetchReports();
  }, [selectedReport]);
  
  
  

  

  const onMarkerPress = (report) => {
    setSelectedReport(report);
    setShowSelectedReport(true);
    modalRef.current?.open();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {location ? (
  <MapView
    style={styles.map}
    provider={PROVIDER_GOOGLE}
    region={{
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
    showsUserLocation={true}
  >
    {reportLocs.map((report) => (
      <Marker
        key={report.id}
        coordinate={report.coordinate}
        title={report.title}
        description = {report.description}
        bounty = {report.bounty}
        onPress={() => onMarkerPress(report)}
      />
    ))}
  </MapView>
) : (
  <View style={styles.loadingContainer}>
    <Text>Loading map...</Text>
  </View>
)}



      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setDropdownVisible(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={lostReportModalVisible}
        onRequestClose={() => setLostReportModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <CreateReportView onClose={() => setLostReportModalVisible(false)} location = {location} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={foundReportModalVisible}
        onRequestClose={() => setFoundReportModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <CreateFoundReportView onClose={() => setFoundReportModalVisible(false)} location = {location} />
        </View>
      </Modal>

      <Modalize
  ref={modalRef}
  alwaysOpen={Dimensions.get('window').height * 0.25}
  modalHeight={Dimensions.get('window').height * 0.9}
  adjustToContentHeight={false}
  withHandle
>
  {showSelectedReport ? (
    <View style={styles.modalContent}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setShowSelectedReport(false)}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{selectedReport.title}</Text>
      <Text style={styles.description}>{selectedReport.description}</Text>
      <Text style={styles.description}>{selectedReport.bounty}</Text>
    </View>
  ) : (
    <FlatList
      data={reports}
      keyExtractor={(item, index) => index.toString()}
      scrollEnabled={false} // ⚡️ important fix
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.reportItem}>
          <Text style={styles.reportTitle}>{item}</Text>
        </View>
      )}
    />
  )}
</Modalize>

{dropdownVisible && (
  <TouchableOpacity
    style={styles.dropdownBackdrop}
    activeOpacity={1}
    onPress={() => setDropdownVisible(false)} // Closes dropdown when backdrop is touched
  >
    <View style={styles.dropdownMenu}>
      <TouchableOpacity style={styles.dropdownItem} onPress={() => {
        setLostReportModalVisible(true)
        setDropdownVisible(false);
        // handle 'Post'
      }}>
        <Text style={styles.dropdownText}>Lost Report</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dropdownItem} onPress={() => {
        setFoundReportModalVisible(true)
        setDropdownVisible(false);
        // handle 'Photos'
      }}>
        <Text style={styles.dropdownText}>Found Report</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
)}

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  reportItem: {
    backgroundColor: '#f0f0f0', // light gray
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center', // centers the text horizontally
    justifyContent: 'center', // centers the text vertically
    elevation: 2, // for shadow on Android
    shadowColor: '#000', // for shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.20)', // semi-transparent backdrop
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 100,
  },
  dropdownMenu: {
    marginTop: 70, // adjust to match your FAB location
    marginRight: 20,
    backgroundColor: '#222', // or white
    borderRadius: 12,
    width: 200,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  dropdownText: {
    color: '#fff', // or #333 if menu is white
    fontSize: 18,
  },
  
  
});
