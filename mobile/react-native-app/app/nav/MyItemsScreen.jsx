
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  Modal,
  TextInput,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { handleUser } from '../../api/user_api';

const { width } = Dimensions.get('window');

export default function MyItemsScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  useEffect(() => {
    fetchUserAndItems();
  }, []);

  const fetchUserAndItems = async () => {
    try {
      // Fetch user profile
      const userData = await handleUser('/profile/', {}, 'GET');
      setUser(userData);
      
      // Fetch user's items
      if (userData?.user_id) {
        const itemsData = await handleUser('/getItemsByUser/', { user_id: userData.user_id }, 'GET');
        setItems(itemsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load your items');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserAndItems();
    setRefreshing(false);
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !newItemDescription.trim()) {
      Alert.alert('Error', 'Please fill in both name and description');
      return;
    }

    try {
      const newItem = await handleUser('/addItemByUser/', {
        user_id: user.user_id,
        name: newItemName.trim(),
        description: newItemDescription.trim(),
      }, 'POST');

      // Add the new item to the list
      setItems([...items, newItem]);
      
      // Reset form
      setNewItemName('');
      setNewItemDescription('');
      setAddItemModalVisible(false);
      
      Alert.alert('Success', 'Item added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await handleUser(`/deleteItemByUser/?item_id=${itemId}&user_id=${user.user_id}`, {}, 'DELETE');
              
              // Remove from local state
              setItems(items.filter(item => item.item_id !== itemId));
              Alert.alert('Success', 'Item deleted successfully!');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item. Please try again.');
            }
          },
        },
      ]
    );
  };

  const ItemCard = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemImageContainer}>
        <View style={styles.itemImagePlaceholder}>
          <Ionicons name="cube-outline" size={30} color="#8B5CF6" />
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemId}>ID: {item.item_id}</Text>
          <View style={styles.itemActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Edit', 'Edit functionality coming soon!')}
            >
              <Ionicons name="create-outline" size={16} color="#8B5CF6" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteItem(item.item_id)}
            >
              <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={60} color="#666" />
      <Text style={styles.emptyTitle}>No Items Yet</Text>
      <Text style={styles.emptyDescription}>
        Start tracking your items by adding your first one!
      </Text>
      <TouchableOpacity 
        style={styles.addFirstItemButton}
        onPress={() => setAddItemModalVisible(true)}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addFirstItemText}>Add Your First Item</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <Text style={styles.headerTitle}>My Items</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddItemModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Lost Items</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Found Items</Text>
        </View>
      </View>

      {/* Items List */}
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.itemsList}>
            {items.map((item) => (
              <ItemCard key={item.item_id} item={item} />
            ))}
          </View>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={addItemModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddItemModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setAddItemModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add New Item</Text>
              <TouchableOpacity onPress={handleAddItem}>
                <Text style={styles.modalSaveText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Item Name</Text>
              <TextInput
                style={styles.textInput}
                value={newItemName}
                onChangeText={setNewItemName}
                placeholder="Enter item name"
                placeholderTextColor="#666"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newItemDescription}
                onChangeText={setNewItemDescription}
                placeholder="Enter item description"
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#232323',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    marginTop: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#232323',
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#363636',
    marginVertical: 10,
  },
  scrollView: {
    flex: 1,
  },
  itemsList: {
    paddingHorizontal: 20,
  },
  itemCard: {
    backgroundColor: '#232323',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImageContainer: {
    marginRight: 15,
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#363636',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
    lineHeight: 20,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemId: {
    fontSize: 12,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#363636',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#2A1A1A',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  addFirstItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addFirstItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 30,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#232323',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#363636',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#999',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#363636',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});