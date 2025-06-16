import React from 'react';
import { ScrollView, Text, StyleSheet, Linking, TouchableOpacity, View } from 'react-native';

const AboutScreen = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sobre o App</Text>

      <Text style={styles.text}>
        Este aplicativo foi desenvolvido como parte do projeto extensionista da disciplina
        Programação para Dispositivos Móveis em Android – Prof. Gabriel Rech Bau.
      </Text>

      <Text style={styles.text}>
        Desenvolvedor: Lucas de Moura Nogueira
        {"\n"}Ano: 2025
      </Text>

      <Text style={styles.subTitle}>Créditos:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.flaticon.com/')}>
        <Text style={[styles.text, styles.link]}>
          - Ícones por flaticon (https://www.flaticon.com/)
        </Text>
      </TouchableOpacity>
      <Text style={styles.text}>- Desenvolvido com React Native (Expo)</Text>
      
      <Text style={styles.text}>
        {"\n"}Este aplicativo não possui fins comerciais.
      </Text>
    </ScrollView>
    <TouchableOpacity style={styles.voltarButton} onPress={() => navigation.goBack()}>
      <Text style={styles.voltarText}>Voltar</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
  },
  voltarButton: {
    backgroundColor: '#4f8ef7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 11,
    marginBottom: 30,
    
  },
  voltarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4f8ef7',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 6,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  link: {
    color: '#4f8ef7',
    textDecorationLine: 'underline',
  },
});

export default AboutScreen;