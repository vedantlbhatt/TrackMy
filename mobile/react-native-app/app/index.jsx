import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import CreateReportView from './CreateReportView';



export default function SheetExample() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Sheet" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        ntransparent={true}
        visible={modalVisible}  
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <CreateReportView onClose={() => setModalVisible(false)} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheetTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
