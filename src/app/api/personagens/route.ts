import { NextResponse } from 'next/server';
import { getDbConnection } from '../../../config/dbConfig';


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const nome = url.searchParams.get('nome'); // Obtém o parâmetro "nome"

    const pool = await getDbConnection();

    // Define a query e o input com base na presença do parâmetro "nome"
    const query = nome
      ? 'SELECT * FROM PERSONAGENS WHERE NOME = @nome'
      : 'SELECT * FROM PERSONAGENS';

    const request = pool.request();
    if (nome) {
      request.input('nome', nome);
    }

    const result = await request.query(query);

    // Processa os resultados
    const personagens = result.recordset.map(item => ({
      ...item,
      IMGS: item.IMGS ? JSON.parse(item.IMGS.replace(/\\/g, '')) : [], // Trata imagens como JSON, se existirem
    }));

    return NextResponse.json(personagens, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return NextResponse.json({ error: 'Erro ao buscar os dados' }, { status: 500 });
  }
}



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, tipo, descricao, imgs } = body;

    if (!nome || !tipo || !descricao || !imgs) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.request()
      .input('nome', nome)
      .input('tipo', tipo)
      .input('descricao', descricao)
      .input('imgs', imgs)
      .query(`
        INSERT INTO PERSONAGENS (NOME, TIPO, DESCRICAO, IMGS) 
        VALUES (@nome, @tipo, @descricao, @imgs);
      `);

    return NextResponse.json({ message: 'Personagem criado com sucesso' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar personagem:', error);
    return NextResponse.json({ error: 'Erro ao criar personagem' }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {nome, tipo, descricao, imgs } = body;

    const pool = await getDbConnection();
    const result = await pool.request()
      .input('nome', nome)
      .input('tipo', tipo)
      .input('descricao', descricao)
      .input('imgs', imgs)
      .query(`
        UPDATE PERSONAGENS 
        SET NOME = @nome, TIPO = @tipo, DESCRICAO = @descricao, IMGS = @imgs 
        WHERE NOME = @nome;
      `);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Personagem atualizado com sucesso' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao atualizar personagem:', error);
    return NextResponse.json({ error: 'Erro ao atualizar personagem' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { nome } = body;

    const pool = await getDbConnection();
    const result = await pool.request()
      .input('nome', nome)
      .query(`DELETE FROM PERSONAGENS WHERE NOME = @nome;`);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Personagem excluído com sucesso' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao excluir personagem:', error);
    return NextResponse.json({ error: 'Erro ao excluir personagem' }, { status: 500 });
  }
}
