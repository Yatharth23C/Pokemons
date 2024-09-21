import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [details, setDetails] = useState([]);
  const [data, setData] = useState([]);
  const [inputvalue,setinputvalue] = useState("");
  const showall = true;
  const SearchPokemon = (event)=>{
    setinputvalue(event.target.value);

  }
  useEffect(() => {
    async function getPokemons() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon');
        const data = await response.json();
        setDetails(data.results);

       
        const pokemonDataPromises = data.results.map(async (pokemon) => {
          const response1 = await fetch(pokemon.url);
          return await response1.json();
        });

        const allPokemonData = await Promise.all(pokemonDataPromises);
        setData(allPokemonData);

      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    }

    getPokemons();
  }, []);

  const FilteredPokemons = details.filter(pokemon=> pokemon.name.toLowerCase().includes(inputvalue.toLowerCase()))

  return (
    <div className='bg-black text-xl p-3 min-w-[700px] rounded-md'>
      <input onChange={SearchPokemon} value = {inputvalue}className='p-1 m-1' placeholder='Search for a Pokemon' />

      {FilteredPokemons.length > 0 &&(
        <div>{FilteredPokemons.map((pokemon, index) => (
        <div key={index} className='m-2 p-2  rounded-lg text-black hover:cursor-pointer hover:bg-blue-600 bg-blue-400'>
          
          
          {data[index] && data[index].sprites && data[index].sprites.front_default && (
            <div className='flex flex-row'>
            <div><img src={data[index].sprites.front_default} alt={pokemon.name} /></div>
            <div className='flex flex-col text-left'>
              <p>Name : {pokemon.name}</p>
              <p>Abilities : {data[index].abilities.map((ability,idx)=>(
                <span key={idx}>
                {ability.ability.name}{idx < data[index].abilities.length - 1 ? ', ' : ''}
              </span>
              ))}</p>
             <p> Weight : {data[index].weight}</p>
             <p> Base experience : {data[index].base_experience}</p>
             </div>
            </div>
          )}
        </div>
      ))}
      </div>)}

    </div>
  );
}

export default App;
