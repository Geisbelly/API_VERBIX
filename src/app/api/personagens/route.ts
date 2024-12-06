import { NextResponse } from 'next/server';
import { getDbConnection } from '../../../config/dbConfig';

// Função auxiliar para manipular a conexão ao banco
async function executeQuery(query, inputs = {}) {
  const pool = await getDbConnection();
  const request = pool.request();
  Object.entries(inputs).forEach(([key, value]) => request.input(key, value));
  return request.query(query);
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const nome = url.searchParams.get('nome');

    const query = nome
      ? 'SELECT * FROM PERSONAGENS WHERE NOME = @nome'
      : 'SELECT * FROM PERSONAGENS';

    const result = await executeQuery(query, nome ? { nome } : {});

    const personagens = result.recordset.map(item => ({
      ...item,
      IMGS: item.IMGS ? JSON.parse(item.IMGS.replace(/\\/g, '')) : [],
    }));

    return NextResponse.json(personagens, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return NextResponse.json({ error: 'Erro ao buscar os dados' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { nome, tipo, descricao, imgs } = await req.json();

    if (!nome || !tipo || !imgs) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    await executeQuery(
      `
      INSERT INTO PERSONAGENS (NOME, TIPO, DESCRICAO, IMGS) 
      VALUES (@nome, @tipo, @descricao, @imgs);
      `,
      { nome, tipo, descricao, imgs }
    );

    return NextResponse.json({ message: 'Personagem criado com sucesso' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar personagem:', error);
    return NextResponse.json({ error: 'Erro ao criar personagem' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { nome, tipo, descricao, imgs } = await req.json();

    if (!nome) {
      return NextResponse.json({ error: 'O campo "nome" é obrigatório' }, { status: 400 });
    }

    const result = await executeQuery(
      `
      UPDATE PERSONAGENS 
      SET TIPO = @tipo, DESCRICAO = @descricao, IMGS = @imgs 
      WHERE NOME = @nome;
      `,
      { nome, tipo, descricao, imgs }
    );

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Personagem atualizado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar personagem:', error);
    return NextResponse.json({ error: 'Erro ao atualizar personagem' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { nome } = await req.json();

    if (!nome) {
      return NextResponse.json({ error: 'O campo "nome" é obrigatório' }, { status: 400 });
    }

    const result = await executeQuery(
      `DELETE FROM PERSONAGENS WHERE NOME = @nome;`,
      { nome }
    );

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Personagem excluído com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir personagem:', error);
    return NextResponse.json({ error: 'Erro ao excluir personagem' }, { status: 500 });
  }
}
