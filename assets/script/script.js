document.addEventListener('DOMContentLoaded', async () => {
    const api = "https://pokeapi.co/api/v2/pokemon"
    const spritesApi = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/"
    const otherSpritesApi = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
    const countPokemon = document.querySelector('.main__pokedex-count');
    const inputSearch = document.querySelector('.main__search-input')
    const btnSearch = document.querySelector('.main__search-button-action')
    const loadMore = document.querySelector('.main__load-button')
    const cards = document.querySelector('.main__cards')

    let offset = 0;
    let limit = 1292;

    const response = await fetch(`${api}/?limit=${1292}`);
    const data = await response.json();

    const createCard = (name, id, types, image) => { 
        const card = document.createElement('div');
        card.classList.add('main__cards-card');

        const cardImage = document.createElement('div');
        cardImage.classList.add('main__cards-card-image');

        const imagePokemon = document.createElement('img');
        imagePokemon.src = image;
        imagePokemon.alt = name;

        const cardContent = document.createElement('div');
        cardContent.classList.add('main__cards-card-content');

        const cardId = document.createElement('span');
        cardId.classList.add('main__cards-card-id');
        cardId.innerHTML = `#${id}`;

        const cardName = document.createElement('span');
        cardName.classList.add('main__cards-card-name');
        cardName.innerHTML = name;

        const cardTypes = document.createElement('div');
        cardTypes.classList.add('main__cards-card-types');

        types.forEach(type => {
            if (type.slot === 1) {
                cardImage.classList.add(`${type.type.name}-background`);
            }
            
            const cardType = document.createElement('span');
            cardType.classList.add('main__cards-card-type');
            cardType.classList.add(`${type.type.name}-type`);
            cardType.innerHTML = type.type.name;
            cardTypes.appendChild(cardType);
        });

        cardImage.appendChild(imagePokemon);
        cardContent.appendChild(cardId);
        cardContent.appendChild(cardName);
        cardContent.appendChild(cardTypes);
        card.appendChild(cardImage);
        card.appendChild(cardContent);
        cards.appendChild(card);
    }

    const fetchUrl = async (url) => {
        const response = await fetch(url);
        const Data = await response.json();
        return Data;
    }

    const getPokemon = async () => {
        let cont = 0
        for (offset; offset <= limit; offset++) {
            cont++
            const pokemonData = await fetchUrl(data.results[offset].url);
            const pokemonImage = `${otherSpritesApi}${pokemonData.id}.png`;
            createCard(pokemonData.name, pokemonData.id, pokemonData.types, pokemonImage);
            await new Promise(r => setTimeout(r, 150));
        }
        countPokemon.value = cont
    }

    try {
        getPokemon();
    } catch (error) {
        console.log(error);
    }

    document.addEventListener('scroll', () => {
        if (document.body.scrollHeight - window.scrollY === window.innerHeight) {
            limit += 20;
            getPokemon();
        }
    });

    btnSearch.addEventListener('click', () => {
        const pokemonInput = inputSearch.value.toLowerCase();
        const pokemon = data.results;
        cards.innerHTML = "";
        let cont = 0
        pokemon.forEach(async pokemon => {
            if (pokemon.name.includes(pokemonInput) || pokemon.url.includes(pokemonInput)) {
                cont++
                const pokemonData = await fetchUrl(pokemon.url);
                const pokemonImage = `${otherSpritesApi}${pokemonData.id}.png`;
                createCard(pokemonData.name, pokemonData.id, pokemonData.types, pokemonImage);
            }
        });
        countPokemon.innerHTML = cont
    });
});