import { NextResponse } from 'next/server';
import { getDbConnection } from '../../../config/dbConfig';

async function executeQuery(query: string, inputs = {}) {
  const pool = await getDbConnection();
  const request = pool.request();
  Object.entries(inputs).forEach(([key, value]) => request.input(key, value));
  return request.query(query);
}

// Função POST para criar uma nova conquista
export async function POST(req: Request) {
  // Configuração de CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Permite o frontend local
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Métodos permitidos
    'Access-Control-Allow-Headers': 'Content-Type', // Cabeçalhos permitidos
  };

  // Responde ao preflight request do CORS
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders }); // Status 204 para requisições preflight
  }

  try {
    // Extrai os dados da requisição
    const body = await req.json();
    const { title, descricao, meta } = body;

    const pool = await getDbConnection();

    // Verifica se já existe uma conquista com o mesmo título
    const existingConquest = await pool.request()
      .input('title', title)
      .query(`
        SELECT * FROM CONQUISTAS WHERE TITLE = @title;
      `);

    // Se já existir, retorna um erro
    if (existingConquest.recordset.length > 0) {
      console.warn(`Conquista com o título "${title}" já existe.`);
      return new NextResponse(
        JSON.stringify({ error: 'Já existe uma conquista com este título' }),
        { status: 409, headers: corsHeaders }
      );
    }

    console.warn(`Conquista com o título "${title}" não existe. Iniciando criação...`);

    // Insere a nova conquista no banco de dados
    await pool.request()
      .input('title', title)
      .input('descricao', descricao)
      .input('meta', meta)
      .query(`
        INSERT INTO CONQUISTAS (TITLE, DESCRICAO, META) 
        VALUES (@title, @descricao, @meta);
      `);

    // Retorna uma mensagem de sucesso
    return new NextResponse(
      JSON.stringify({ message: 'Conquista criada com sucesso' }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Erro ao criar conquista:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erro interno ao criar conquista' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Função GET para recuperar todas as conquistas
export async function GET() {
  try {
    const pool = await getDbConnection();

    // Fazendo a consulta para pegar todas as conquistas
    const result = await pool.request().query(`
      SELECT * FROM CONQUISTAS
    `);

    // Retorna os dados como JSON
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return NextResponse.json({ error: 'Erro ao buscar os dados das conquistas' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { nome } = await req.json();

    if (!nome) {
      return NextResponse.json({ error: 'O campo "id" é obrigatório' }, { status: 400 });
    }

    const result = await executeQuery(
      `DELETE FROM PERSONAGENS WHERE ID = @id;`,
      { nome }
    );

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: 'Conquista não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Conquista excluído com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir Conquista:', error);
    return NextResponse.json({ error: 'Erro ao excluir Conquista' }, { status: 500 });
  }
}
