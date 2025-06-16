# VoceLembra

Aplicativo de organização pessoal para tarefas, compras e finanças.

---

# Sobre o App

O **VoceLembra** é um aplicativo desenvolvido para ajudar usuários a organizar tarefas diárias, listas de compras e lançamentos financeiros, com interface moderna e intuitiva.

Projeto criado como parte da disciplina **Programação para Dispositivos Móveis em Android** – Prof. Gabriel Rech Bau.

---

# Funcionalidades

- **Tarefas**
  - Adicione, conclua, e exclua tarefas.
  - Defina horário da tarefa
  - Visualize o total de tarefas concluídas.

- **Compras**
  - Adicione itens à lista de compras, com quantidade e categoria.
  - Marque itens como comprados (fica riscado).
  - Exclua itens da lista.

- **Finanças**
  - Adicione lançamentos de receita ou despesa, com valor, descrição e categoria.
  - Visualize totais de receitas, despesas e saldo.
  - Exclua lançamentos.

- **Sobre**
  - Informações sobre o app, créditos e agradecimentos.

---

## Como rodar o projeto

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/vocelembra.git
   cd vocelembra
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Execute o app:**
   ```sh
   npx expo start
   ```
   > **Observação:**  
   > O Expo CLI agora é executado via `npx expo` e não precisa ser instalado globalmente.

4. **Abra no seu celular:**
   - Instale o app [Expo Go](https://expo.dev/expo-go) na Play Store ou App Store.
   - Escaneie o QR code exibido no terminal ou navegador.

---

# Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (executado via `npx expo`)
- [Node.js](https://nodejs.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker)

---


# Desenvolvedor

- Lucas de Moura Nogueira

---

# Créditos

- Ícones por [flaticon](https://www.flaticon.com/)
- Desenvolvido com React Native (Expo)

---

# Observações Importantes


- Os dados são salvos localmente no dispositivo usando AsyncStorage.
