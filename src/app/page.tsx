'use client'
import updateCharacter from '../components/put'
import deleteCharacter from '../components/delete'
import postCharacter from '../components/post'

export default function Home() {

  return (
    <div>
      <button onClick={updateCharacter} className='align-center justify-center'>UPDATE</button>
      <button onClick={deleteCharacter} className='align-center justify-center'>DELETE</button>
      <button onClick={postCharacter} className='align-center justify-center'>POST</button>
    </div>
  );
}
