//OK
const data = {
  nome: 'lioh'
};

// Função para fazer o DELETE para o endpoint
async function deleteCharacter() {
  try {
    // Enviar a requisição DELETE
    const response = await fetch('http://localhost:3000//api/personagens', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', // Indica que estamos enviando dados em JSON
      },
      body: JSON.stringify(data), // Convertendo o objeto JavaScript em JSON
    });

    if (response.ok) {
      const result = await response.json(); // Lê a resposta como JSON diretamente
      console.log('Personagem excluído:', result);
    } else {
      const responseText = await response.text(); // Leitura como texto caso haja erro
      console.error('Erro na requisição:', response.status, response.statusText, responseText);
    }
  } catch (error) {
    console.error('Erro ao fazer requisição:', error);
  }
}

export default deleteCharacter;
