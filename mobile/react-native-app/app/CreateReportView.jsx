import { StyleSheet, Text, View, Dimensions, Button, TextInput } from 'react-native'
import React, {useState} from 'react'
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { handleUser } from '../api/user_api';

const { height } = Dimensions.get('window');

const CreateReportView = ({onClose}) => {

    const [marker, setMarker] = useState(null);
    const [radius, setRadius] = useState(50);
    const [lostItemName, setLostItemName] = useState('');
    const [lostItemDescription, setLostItemDescription] = useState('');
    const [lostItemBounty, setLostItemBounty] = useState('');

    const region = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    
  return (
    <View style={styles.sheet}>
        <Text style={[styles.sheetTitle]}>Submit Report</Text>
        <Text>${lostItemName}</Text>
        <Button title="Close" onPress={onClose} />
        <Button
                title="Submit This Johnson!"
                onPress={() => handleUser('/addItemByUser/', { name: lostItemName}, 'POST')}
        />

      <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
      onChangeText={newText => setLostItemName(newText)} 
      value={lostItemName} 
      placeholder="What did you lose?" 
      />

      <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
      onChangeText={newText => setLostItemDescription(newText)} 
      value={lostItemDescription} 
      placeholder="Additional Information" 
      />

      <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
      onChangeText={newText => setLostItemBounty(newText)} 
      value={lostItemBounty} 
      placeholder="PLACEHOLDER for Bounty" 
      />
        
        <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Radius: {radius.toFixed(0)}m</Text>

        <Slider
          style={{ width: '100%', height: 40}}
          minimumValue={10}
          maximumValue={500}
          step={10}
          value={radius}
          onValueChange={setRadius}
          minimumTrackTintColor="#FF0000"
          maximumTrackTintColor="#999999"
        />

      </View>
        <MapView
        style={styles.map}
        initialRegion={region}
        onPress={(e) => {
          setMarker(e.nativeEvent.coordinate);
        }}
      >
        {marker && (
          <>
            <Marker coordinate={marker} />
            <Circle
              center={marker}
              radius={radius}
              strokeColor="rgba(255,0,0,0.5)"
              fillColor="rgba(255,0,0,0.2)"
            />
          </>
        )}
      </MapView>
    </View>
  );
};

export default CreateReportView

const styles = StyleSheet.create({
    map: {
      flex: 1,
    },
    sheet: {
        height: height * 0.9,
        backgroundColor: 'white',
        padding: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      }
})