import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput,  FlatList, Button, TouchableOpacity, StyleSheet, Switch, Platform, Image, Alert, Keyboard} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';




const TarefaScreen = ({ navigation }) => {
  const [tarefa, setTarefa] = useState('');
  const [horario, setHorario] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const [usarHorario, setUsarHorario] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const carregouRef = useRef(false);
  const concluido = tarefas.filter(t => t.concluido).length;

  // Carrega tarefas e verifica a data
  useEffect(() => {
    const inicializar = async () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const lastDate = await AsyncStorage.getItem('lastDate');
      if (lastDate && lastDate !== todayStr) {
        // Dia mudou, limpa tarefas 
        setTarefas([]);
        await AsyncStorage.setItem('tarefas', JSON.stringify([]));
      } else {
       
        const tarefasSalvas = await AsyncStorage.getItem('tarefas');
        if (tarefasSalvas) {
          setTarefas(JSON.parse(tarefasSalvas));
        }
      }
      await AsyncStorage.setItem('lastDate', todayStr);
      carregouRef.current = true;
    };
    inicializar();
  }, []);

  // Salva tarefas sempre que mudar, mas só depois do carregamento inicial
  useEffect(() => {
    if (carregouRef.current) {
      AsyncStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
  }, [tarefas]);

  // Função para alternar completado
  const Concluido = (id) => {
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === id ? { ...tarefa, concluido: !tarefa.concluido } : tarefa
    ));
  };

  const adicionarTarefa = async () => {
    Keyboard.dismiss(); // Fecha o teclado
    if (tarefa.trim() === '') {
      Alert.alert('Atenção', 'Digite o nome da tarefa!');
      return;
    }

    let notificationId = null;
    if (usarHorario && horario) {
      // Parse horário para Date
      const [hour, minute] = horario.split(':').map(Number);
      const now = new Date();
      let scheduledDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        0
      );
      // Se o horário já passou , agenda para amanhã
      if (scheduledDate < now) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      
    }

    const novaTarefa = {
      id: Date.now().toString(),
      titulo: tarefa,
      horario: usarHorario ? horario : '',
      concluido: false,
      notificationId
    };
    setTarefas([...tarefas, novaTarefa]);

    setTarefa('');
    setHorario('');
    setUsarHorario(false);
    setSelectedDate(new Date());
  };

  const onChangeTime = ( selected) => {
    setShowPicker(false);
    if (selected) {
      setSelectedDate(selected);
      const hours = selected.getHours().toString().padStart(2, '0');
      const minutes = selected.getMinutes().toString().padStart(2, '0');
      setHorario(`${hours}:${minutes}`);
    }
  };

  

  const removerTarefa = (id) => {
    setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
  };
  

  return (
    
    <View style={styles.container}>
      <Text style={styles.subTitle}>
        Tarefas concluídas: {concluido}
      </Text>
      <Text style={styles.title}>Adicionar Tarefa:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Lavar a louça"
        value={tarefa}
        onChangeText={text => setTarefa(text.replace(/[0-9]/g,''))}
        keyboardType="default"
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Switch value={usarHorario} onValueChange={setUsarHorario} />
        <Text style={{ marginLeft: 8 }}>Adicionar horário?</Text>
      </View>

      {usarHorario && (
        <>
          <Text style={styles.title}>Adicionar Horário:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker(true)}
          >
            <Text>
              {horario ? `Horário selecionado: ${horario}` : 'Selecione o horário'}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeTime}
            />
          )}
        </>
      )}
 
      <TouchableOpacity style={{backgroundColor:'#4f8ef7', padding:12, borderRadius:8, alignItems:'center', marginBottom:10}} onPress={adicionarTarefa}>
        <Text style={{color:'#fff', fontWeight:'bold', fontSize:16}}>Adicionar Tarefa</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Tarefas:</Text>
      <FlatList
        data={tarefas.filter(tarefa => !tarefa.concluido)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          item && item.titulo ? (
            <View style={styles.tarefaItem}>
              <Text style={item.concluido ? styles.concluido : null}>
                {item.titulo}
                {item.horario ? ` - ${item.horario}` : ''}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={styles.concluidoBtn}
                  onPress={() => Concluido(item.id)}
                >
                  
                    <Image
                      source={require('../assets/verificar.png')}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                    />
                 
                    
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.excluirBtn}
                  onPress={() => removerTarefa(item.id)}
                >
                  <Image
                    source={require('../assets/lixo.png')}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      />

      <TouchableOpacity style={styles.voltarButton} onPress={() => navigation.goBack()}>
        <Text style={styles.voltarText}>Voltar</Text>
      </TouchableOpacity>
    </View>
    
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 40,
    backgroundColor: 'rgba(255,255,255,0.85)', 
    borderRadius: 16,
    margin: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4f8ef7',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4f8ef7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#333',
  },
  tarefaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
   
  },
  concluido: {
    textDecorationLine: 'line-through',
    color: '#888',
    
  },
  concluidoBtn: {
    padding: 6,
    marginRight: 8,
    backgroundColor: '#4caf50',
    borderRadius: 20,
  },
  concluidoTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  excluirBtn: {
    padding: 6,
    marginLeft: 10,
    backgroundColor: '#ff5555',
    borderRadius: 20,
  },
  excluirTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  voltarButton: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: '#4f8ef7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  voltarText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  adicionarBtn: {
    backgroundColor: '#4f8ef7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
});



export default TarefaScreen;