import { useState } from 'react';
import Button from '../../ui/Button';

function CreateUser() {
  const [username, setUsername] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3'>
      <p className='text-s sm:text-base'>👋 Welcome!<br className='sm:hidden'/> Please start by telling us your name:</p>

      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        minLength='2'
        className=' input focus:ring-amber-400 py-2 px-5'
      />

      {username !== '' && username.length > 1 &&(
        <div>
          <Button>Start ordering</Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
