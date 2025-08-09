import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import CreateReportView from './CreateReportView';
import { handleUser } from '../api/user_api';
import { Redirect } from 'expo-router';


export default function Index() {
  return <Redirect href="/Home" />;
}

