import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput,  FlatList, TouchableOpacity, StyleSheet, Switch, Keyboard, Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIAS = ['Mercado', 'Farmácia', 'Hortifruti', 'Padaria', 'Outros'];

const PurchaseScreen = ({ navigation }) => {
  const [item, setItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [compras, setCompras] = useState([]);
  const [usarQuantidade, setUsarQuantidade] = useState(false);
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const carregouRef = useRef(false);
  

  

  // Carrega compras e verifica se mudou o dia ao abrir a tela
 useEffect(() => {
  const inicializar = async () => {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const lastDate = await AsyncStorage.getItem('lastDatePurchase');
      if (lastDate && lastDate !== todayStr) {
        setCompras([]);
        await AsyncStorage.setItem('compras', JSON.stringify([]));
      } else {
        const comprasSalvas = await AsyncStorage.getItem('compras');
        if (comprasSalvas) {
          setCompras(JSON.parse(comprasSalvas));
        }
      }
      await AsyncStorage.setItem('lastDatePurchase', todayStr);
      carregouRef.current = true;
    } catch (e) {
      console.log('Erro ao carregar dados:', e);
    }
  };
  inicializar();
}, []);



  // Salva compras sempre que mudar
  useEffect(() => {
    if (carregouRef.current) {
      AsyncStorage.setItem('compras', JSON.stringify(compras));
    }
  }, [compras]);

  const adicionarCompra = () => {
    Keyboard.dismiss(); 
    if (item.trim() === '') {
      Alert.alert('Atenção', 'Digite o nome do item!');
      return;
    }
    const novaCompra = {
      id: Date.now().toString(),
      nome: item,
      quantidade: usarQuantidade ? quantidade : '',
      categoria,
      comprado: false,
    };
    setCompras([...compras, novaCompra]);
    setItem('');
    setQuantidade('');
    setUsarQuantidade(false);
    setCategoria(CATEGORIAS[0]);
  };

  const removerCompra = (id) => {
    setCompras(compras.filter(c => c.id !== id));
  };

  const alternarComprado = (id) => {
    setCompras(compras.map(c =>
      c.id === id ? { ...c, comprado: !c.comprado } : c
    ));
  };

  
  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Item de Compra:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Arroz"
        value={item}
        onChangeText={setItem}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Switch value={usarQuantidade} onValueChange={setUsarQuantidade} />
        <Text style={{ marginLeft: 8 }}>Adicionar quantidade?</Text>
      </View>

      {usarQuantidade && (
        <TextInput
          style={styles.input}
          placeholder="Ex: 2 kg"
          value={quantidade}
          onChangeText={setQuantidade}
        />
      )}

      <Text style={styles.title}>Categoria:</Text>
      <View style={styles.categoriasContainer}>
        {CATEGORIAS.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoriaBtn,
              categoria === cat && styles.categoriaBtnAtiva,
            ]}
            onPress={() => setCategoria(cat)}
          >
            <Text style={categoria === cat ? styles.categoriaTxtAtiva : styles.categoriaTxt}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={{backgroundColor:'#4f8ef7',
        padding:12, borderRadius:8, alignItems: 'center', marginBottom:10}} onPress={adicionarCompra}>
        <Text style={{color:'#fff', fontWeight:'bold'}}>Adicionar Compra</Text>  
          </TouchableOpacity> 

      <Text style={styles.subTitle}>Lista de Compras:</Text>
      <FlatList
        data={compras}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCompra}>
            <Text style={item.comprado ? styles.completado : null}>
              {item.nome}
              {item.quantidade ? ` - ${item.quantidade}` : ''}
              {item.categoria ? ` (${item.categoria})` : ''}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.completadoBtn}
                onPress={() => alternarComprado(item.id)}
              >
                <Text style={styles.completadoTxt}>
                  {item.comprado ? 'Desfazer' : 'Comprado'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.excluirBtn}
                onPress={() => removerCompra(item.id)}
              >
                
                <Text style={styles.excluirTxt}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4f8ef7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoriaBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginRight: 8,
    marginBottom: 8,
  },
  categoriaBtnAtiva: {
    backgroundColor: '#4f8ef7',
  },
  categoriaTxt: {
    color: '#333',
  },
  categoriaTxtAtiva: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemCompra: {
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
  completado: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  completadoBtn: {
    padding: 6,
    marginRight: 8,
    backgroundColor: '#4caf50',
    borderRadius: 20,
  },
  completadoTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  excluirBtn: {
    padding: 6,
    backgroundColor: '#ff5555',
    borderRadius: 20,
    marginLeft: 10,
  },
  excluirTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PurchaseScreen;