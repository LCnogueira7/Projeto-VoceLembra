import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
  
// Define a Homescreen 
  return (
    <ImageBackground
      source={require ('../assets/Home.png' )}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={ styles.overlay }/>
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.header}>VoceLembra</Text>
      

      <ScrollView contentContainerStyle={styles.cardsContainer}>
        

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('tarefas')}>
          <Text style={styles.cardText}>Tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('compras')}>
          <Text style={styles.cardText}>Compras</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('finanças')}>
          <Text style={styles.cardText}>Finanças</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.About} onPress={() => navigation.navigate('sobre')}>
          <Text style={styles.AboutText}>Sobre</Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.footer}>© 2025 VoceLembra</Text>
    </SafeAreaView>
    </ImageBackground>
  );
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 11,
    marginTop: 20,
    color: '#333',
    justifyContent: 'center',
    textAlign: 'center',
    
  },
 
  cardsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#4f8ef7',
    padding: 10,
    borderRadius: 13,
    marginBottom: 35,
    alignItems: 'center',
  },
  cardAbout: {
    backgroundColor: '#4f8ef7',
    padding: 2,
    borderRadius: 13,
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  cardText: {
    
    color: '#000000',
    fontSize: 40,
    fontWeight: '500',
  },
  AboutText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    padding: 10,
    color: '#aaa',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
   
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
  }
});
