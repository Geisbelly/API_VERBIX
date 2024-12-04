import { NextResponse } from 'next/server';
import { getDbConnection } from '../../../../config/dbConfig';

async function buscarPersonagem(id: string) {
  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input('NOME', id)
      .query('SELECT * FROM PERSONAGENS WHERE LOWER(NOME) = LOWER(@NOME)');

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Personagem não encontrado' },
        { status: 404 }
      );
    }

    const processedResult = result.recordset.map(item => ({
      ...item,
      IMGS: JSON.parse(item.IMGS.replace(/\\/g, '')),
    }));

    return NextResponse.json(processedResult, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar personagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {

    // O acesso ao `params` precisa ser feito de forma assíncrona
    const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Parâmetro "id" não fornecido' },
      { status: 400 }
    );
  }

  console.log('id recebido:', id);
  return buscarPersonagem(id);
}
