import { StyleSheet, Text, View, Dimensions, Button } from 'react-native'
import React, {useState} from 'react'
import MapView, { Marker, Circle } from 'react-native-maps';

const { height } = Dimensions.get('window');

const CreateReportView = ({onClose}) => {

    const [marker, setMarker] = useState(null);


    const region = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    
  return (
    <View style={styles.sheet}>
        <Text style={[styles.sheetTitle]}>Submit Report</Text>
        <Button title="Close" onPress={onClose} />

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
              radius={500}
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