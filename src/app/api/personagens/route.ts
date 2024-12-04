import { NextResponse } from 'next/server';
import { getDbConnection } from '../../../config/dbConfig';

interface params {
  NOME: string;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const nome = url.searchParams.get('NOME');
    console.log('Parametro NOME:', nome);

    const pool = await getDbConnection();
    let query = 'SELECT * FROM PERSONAGENS';
    const params: params = { NOME: nome || '' };  // Se 'nome' for nulo, define como string vazia

    if (nome) {
      query += ' WHERE LOWER(NOME) = LOWER(@NOME)';
    }

    const result = await pool.request()
      .input('NOME', params.NOME)
      .query(query);

    // Processar os resultados
    const processedResult = result.recordset.map(item => ({
      ...item,
      IMGS: JSON.parse(item.IMGS.replace(/\\/g, '')) // Tratando imagens no JSON
    }));

    return NextResponse.json(processedResult);  // Retorna os dados

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return NextResponse.json({ error: 'Erro ao buscar os dados' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, tipo, descricao, imgs } = body;

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
    const { id, nome, tipo, descricao, imgs } = body;

    const pool = await getDbConnection();
    const result = await pool.request()
      .input('id', id)
      .input('nome', nome)
      .input('tipo', tipo)
      .input('descricao', descricao)
      .input('imgs', imgs)
      .query(`
        UPDATE PERSONAGENS 
        SET NOME = @nome, TIPO = @tipo, DESCRICAO = @descricao, IMGS = @imgs 
        WHERE ID = @id;
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
    const { id } = body;

    const pool = await getDbConnection();
    const result = await pool.request()
      .input('id', id)
      .query(`DELETE FROM PERSONAGENS WHERE ID = @id;`);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: 'Personagem não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Personagem excluído com sucesso' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao excluir personagem:', error);
    return NextResponse.json({ error: 'Erro ao excluir personagem' }, { status: 500 });
  }
}
