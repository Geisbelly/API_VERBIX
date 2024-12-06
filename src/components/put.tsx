//OK
const data = {
    nome: 'Amanda', // Nome do personagem a ser atualizado
    tipo: 'Heroi',  // Tipo do personagem
    descricao: 'Personagem heroico com poderes especiais', // Descrição
    imgs: 'image1.jpg' // Lista de imagens em formato de string
};
  
  // Função para fazer a requisição PUT
async function updateCharacter() {
    try {
      // Enviar a requisição PUT
      const response = await fetch('https://api-verbix.vercel.app/api/personagens', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Indica que estamos enviando dados em JSON
        },
        body: JSON.stringify(data), // Convertendo o objeto JavaScript em JSON
      });
  
      if (response.ok) {
        const result = await response.json(); // Lê a resposta como JSON
        console.log('Personagem atualizado:', result);
      } else {
        const responseText = await response.text(); // Lê a resposta como texto para debugar
        console.error('Erro na requisição:', response.status, response.statusText, responseText);
      }
    } catch (error) {
      console.error('Erro ao fazer requisição:', error);
    }
  }
  
  export default  updateCharacter; // Chama a função para executar
  