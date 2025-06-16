import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet , Keyboard, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIAS = ['Alimentação', 'Transporte', 'Lazer', 'Salário', 'Outros'];

const FinancaScreen = ({ navigation }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('Despesa'); // 'Despesa' ou 'Receita'
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [lancamentos, setLancamentos] = useState([]);
  const carregouRef = useRef(false);

  // Carrega lançamentos e checa se mudou o dia ao abrir a tela
  useEffect(() => {
    const inicializar = async () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const lastDate = await AsyncStorage.getItem('lastDateFinance');
      if (lastDate && lastDate !== todayStr) {
        setLancamentos([]);
        await AsyncStorage.setItem('lancamentos', JSON.stringify([]));
      } else {
        const lancamentosSalvos = await AsyncStorage.getItem('lancamentos');
        if (lancamentosSalvos) {
          setLancamentos(JSON.parse(lancamentosSalvos));
        }
      }
      await AsyncStorage.setItem('lastDateFinance', todayStr);
      carregouRef.current = true;
    };
    inicializar();
  }, []);

  // Salva lançamentos 
  useEffect(() => {
    if (carregouRef.current) {
      AsyncStorage.setItem('lancamentos', JSON.stringify(lancamentos));
    }
  }, [lancamentos]);

  const adicionarLancamento = () => {
    Keyboard.dismiss(); 
    if (descricao.trim() === '' || valor.trim() === '' || isNaN(Number(valor))){ 
      Alert.alert('Atenção', 'Preencha todos os campos corretamente!');
      return;}
    const novoLancamento = {
      id: Date.now().toString(),
      descricao,
      valor: parseFloat(valor),
      tipo,
      categoria,
    };
    setLancamentos([...lancamentos, novoLancamento]);
    setDescricao('');
    setValor('');
    setTipo('Despesa');
    setCategoria(CATEGORIAS[0]);
  };

  const removerLancamento = (id) => {
    setLancamentos(lancamentos.filter(l => l.id !== id));
  };

  // Calcula o resultado de receitas e despesas
  const totalReceitas = lancamentos.filter(l => l.tipo === 'Receita').reduce((acc, l) => acc + l.valor, 0);
  const totalDespesas = lancamentos.filter(l => l.tipo === 'Despesa').reduce((acc, l) => acc + l.valor, 0);
  const resultado = totalReceitas - totalDespesas;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Lançamento:</Text>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor (ex: 100.00)"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[styles.tipoBtn, tipo === 'Despesa' && styles.tipoBtnAtivo]}
          onPress={() => setTipo('Despesa')}
        >
          <Text style={tipo === 'Despesa' ? styles.tipoTxtAtivo : styles.tipoTxt}>Despesa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tipoBtn, tipo === 'Receita' && styles.tipoBtnAtivo]}
          onPress={() => setTipo('Receita')}
        >
          <Text style={tipo === 'Receita' ? styles.tipoTxtAtivo : styles.tipoTxt}>Receita</Text>
        </TouchableOpacity>
      </View>

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
          padding:12, borderRadius:8, alignItems: 'center',
          marginBottom:10}} onPress={adicionarLancamento}>
      <Text style={{color:'#fff', fontWeight:'bold', fontSize:16}}>Adicionar Lançamento</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Lançamentos:</Text>
      <FlatList
        data={lancamentos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemLancamento}>
            <Text style={item.tipo === 'Despesa' ? styles.despesa : styles.receita}>
              {item.tipo === 'Despesa' ? '-' : '+'} R$ {item.valor.toFixed(2)} | {item.descricao} ({item.categoria})
            </Text>
            <TouchableOpacity
              style={styles.excluirBtn}
              onPress={() => removerLancamento(item.id)}
            >
              <Text style={styles.excluirTxt}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.resultadoContainer}>
        <Text style={styles.resultadoTxt}>
          Total de Receitas: <Text style={styles.receita}>R$ {totalReceitas.toFixed(2)}</Text>
        </Text>
        <Text style={styles.resultadoTxt}>
          Total de Despesas: <Text style={styles.despesa}>R$ {totalDespesas.toFixed(2)}</Text>
        </Text>
        <Text style={styles.resultadoFinal}>
          Resultado: <Text style={resultado >= 0 ? styles.receita : styles.despesa}>R$ {resultado.toFixed(2)}</Text>
        </Text>
      </View>

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
  tipoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tipoBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  tipoBtnAtivo: {
    backgroundColor: '#4f8ef7',
  },
  tipoTxt: {
    color: '#333',
  },
  tipoTxtAtivo: {
    color: '#fff',
    fontWeight: 'bold',
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
  itemLancamento: {
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
  despesa: {
    color: '#ff5555',
    fontWeight: 'bold',
  },
  receita: {
    color: '#4caf50',
    fontWeight: 'bold',
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
  resultadoContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  resultadoTxt: {
    fontSize: 16,
    marginBottom: 4,
  },
  resultadoFinal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  voltarButton: {
    marginTop:30,
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

export default FinancaScreen;