// OK
const data = {
  nome: 'Amanda',
  tipo:'Princesa',
  descricao: 'Descrição da nova conquista',
  imgs: 'https:'
};

// Função para fazer o POST para o endpoint
async function postCharacter() {
  try {
    // Enviar a requisição POST
    const response = await fetch('http://localhost:3000//api/personagens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Indica que estamos enviando dados em JSON
      },
      body: JSON.stringify(data), // Convertendo o objeto JavaScript em JSON
    });

    const responseText = await response.text(); // Lê a resposta como texto para debugar
    if (response.ok) {
      let result = {};
      try {
        result = JSON.parse(responseText); // Tenta fazer o parse manualmente
      } catch (e) {
        console.error('Erro ao parsear JSON:', e);
      }
      console.log('Conquista criada:', result);
    } else {
      console.error('Erro na requisição:', response.status, response.statusText, responseText);
    }
  } catch (error) {
    console.error('Erro ao fazer requisição:', error);
  }
}

export default postCharacter;
