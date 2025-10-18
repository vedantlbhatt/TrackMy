import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const BountyClaimModal = ({ visible, onClose, onClaim, report, user }) => {
  const [claimMessage, setClaimMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmitClaim = () => {
    if (!claimMessage.trim()) {
      Alert.alert('Error', 'Please provide details about how you found the item');
      return;
    }

    if (!contactInfo.trim()) {
      Alert.alert('Error', 'Please provide your contact information');
      return;
    }

    Alert.alert(
      'Submit Claim',
      'Are you sure you want to submit this claim? The item owner will be notified.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            onClaim({
              reportId: report.id,
              claimMessage,
              contactInfo,
              finderId: user.user_id,
              bountyAmount: report.bounty,
            });
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Claim Bounty</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.bountyInfo}>
              <Text style={styles.bountyAmount}>${report?.bounty || 0}</Text>
              <Text style={styles.bountyLabel}>Bounty Reward</Text>
            </View>

            <Text style={styles.itemTitle}>{report?.title}</Text>
            <Text style={styles.itemDescription}>{report?.description}</Text>

            <Text style={styles.label}>How did you find this item?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe where and how you found the item..."
              placeholderTextColor="#999"
              value={claimMessage}
              onChangeText={setClaimMessage}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Your Contact Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number or email"
              placeholderTextColor="#999"
              value={contactInfo}
              onChangeText={setContactInfo}
            />

            <View style={styles.noteContainer}>
              <FontAwesome name="info-circle" size={16} color="#007AFF" />
              <Text style={styles.noteText}>
                The item owner will be notified and can verify your claim. If approved, you'll receive the bounty payment.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmitClaim}
            >
              <Text style={styles.submitButtonText}>Submit Claim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '95%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  bountyInfo: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  bountyAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28a745',
  },
  bountyLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BountyClaimModal;
