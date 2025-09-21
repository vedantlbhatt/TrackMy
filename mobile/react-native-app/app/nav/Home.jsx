import React, { useState, useRef, createContext, useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, FlatList, SafeAreaView, ScrollView, Button
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { Modalize } from 'react-native-modalize';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import CreateReportView from '../CreateReportView';
import CreateFoundReportView from '../CreateFoundReportView';
import { handleUser } from '../../api/user_api';
import * as Location from "expo-location";
import Ionicons from 'react-native-vector-icons/Ionicons';
import SubmitClaimScreen from '../SubmitClaimScreen';

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

  const [claimFormModalVisible, setClaimFormModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (loc) => {
          setLocation(loc.coords);
        });
      return () => subscription.remove();
    })();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      if (!selectedReport) {
        const data = await handleUser('/getAllLostReports/', {}, 'GET');
        if (Array.isArray(data)) {
          const reportsData = data.map((report) => ({
            id: report.lost_report_id,
            title: report.title,
            coordinate: {
              latitude: parseFloat(report.latitude),
              longitude: parseFloat(report.longitude),
            },
            description: report.description,
            bounty: report.bounty,
            radius: report.radius,
          }));
          setReports(reportsData);
          setReportLocs(reportsData);
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

  const renderFeedHeader = () => (
    <View>
      <View style={styles.feedHeaderRow}>
        <Text style={styles.feedHeaderText}>Feed</Text>
        <TouchableOpacity
          style={styles.lostButton}
          onPress={() => setLostReportModalVisible(true)}
        >
          <Text style={styles.lostButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.feedDivider} />
    </View>
  );
  
  return (

    
    <SafeAreaView style={{ flex: 1 }}>
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
            {showSelectedReport && selectedReport?.coordinate && (
              <Circle
                center={selectedReport.coordinate}
                radius={selectedReport.radius || 0}
                strokeColor="#007AFF"
                fillColor="rgba(0,122,255,0.1)"
              />
            )}
            {reportLocs.map((report) => (
              <Marker
                key={report.id}
                coordinate={report.coordinate}
                title={report.title}
                description={report.description}
                onPress={() => onMarkerPress(report)}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text>Loading map...</Text>
          </View>
        )}

        {/* FAB + Dropdown */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Modals for report creation */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={lostReportModalVisible}
          onRequestClose={() => setLostReportModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <CreateReportView
              onClose={() => setLostReportModalVisible(false)}
              location={location}
            />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={foundReportModalVisible}
          onRequestClose={() => setFoundReportModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <CreateFoundReportView
              onClose={() => setFoundReportModalVisible(false)}
              location={location}
            />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={claimFormModalVisible}
          onRequestClose={() => setClaimFormModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <SubmitClaimScreen
              onClose={() => setClaimFormModalVisible(false)}
            />
          </View>
        </Modal>

        

        {/* MODALIZE with detail/feed toggle */}
        <Modalize
          ref={modalRef}
          alwaysOpen={Dimensions.get("window").height * 0.25}
          modalHeight={Dimensions.get("window").height * 0.9}
          adjustToContentHeight={false}
          withHandle
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
        >
          {showSelectedReport && selectedReport ? (
            // --- DETAILS VIEW ---
            <View contentContainerStyle={styles.modalContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowSelectedReport(false)}
              >
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>{selectedReport.title}</Text>
              <Text style={styles.description}>{selectedReport.description}</Text>
              <Text style={styles.description}>Bounty: {selectedReport.bounty}</Text>

              <TouchableOpacity
          onPress={() => {
            setClaimFormModalVisible(true);
          }}
          style={styles.claimButton} // Add your button styling here
        >
          <Text style={styles.claimButtonText}>Claim</Text>
        </TouchableOpacity>

            </View>
          ) : (
            // --- FEED VIEW ---
            <View style={{ flex: 1 }}>
              

              {/* List */}
              <FlatList
                data={reportLocs}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.feedListContent}
                scrollEnabled={false}
                ListHeaderComponent={renderFeedHeader}
                stickyHeaderIndices={[0]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.feedItem}
                    onPress={() => {
                      setSelectedReport(item);
                      setShowSelectedReport(true);
                    }}
                  >
                    <View style={styles.feedInfo}>
                      <Text style={styles.feedItemTitle}>{item.title}</Text>
                      <Text style={styles.feedItemDesc}>{item.description}</Text>
                      <Text style={styles.feedItemMeta}>
                        Bounty: {item.bounty ?? "None"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </Modalize>

        {/* Dropdown for adding reports */}
        {dropdownVisible && (
          <TouchableOpacity
            style={styles.dropdownBackdrop}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                setLostReportModalVisible(true);
                setDropdownVisible(false);
              }}>
                <Text style={styles.dropdownText}>Lost Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                setFoundReportModalVisible(true);
                setDropdownVisible(false);
              }}>
                <Text style={styles.dropdownText}>Found Report</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  reportItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  reportMeta: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B5CF6',
    marginTop: 2,
  },
  reportDesc: {
    fontSize: 13,
    color: '#46526e',
    marginBottom: 3,
    letterSpacing: 0.03,
  },
  map: {
    flex: 1,
  },
  feedPanel: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 6,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  feedHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#575575',
  },
  lostButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 17,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  lostButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
  feedDivider: {
    height: 1,
    backgroundColor: "#ececec",
    marginHorizontal: 12,
    marginBottom: 2,
  },
  feedList: {
    maxHeight: 240,
  },
  feedListContent: {
    paddingVertical: 8,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FB',
    backgroundColor: '#fff',
  },
  feedInfo: {
    flex: 1,
    minWidth: 0,
  },
  feedItemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  feedItemDesc: {
    fontSize: 13,
    color: '#46526e',
    marginBottom: 3,
    letterSpacing: 0.03,
  },
  feedItemMeta: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#333',
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
    top: 20,
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
    backgroundColor: 'rgba(0,0,0,0.20)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 100,
  },
  dropdownMenu: {
    marginTop: 70,
    marginRight: 20,
    backgroundColor: '#222',
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
    color: '#fff',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
});
