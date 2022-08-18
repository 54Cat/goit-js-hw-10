const URL = 'https://restcountries.com/v2';
const FILTER = ['name', 'capital', 'population', 'flags', 'languages'];
const filterResponse = FILTER.join(",");

export default function fetchCountry(searchedCountry) {
    return fetch(`${URL}/name/${searchedCountry}?fields=${filterResponse}`)
        .then(response => {               
            if (!response.ok) {
                const error = new Error();
                error.code = response.status;
                throw error;
            }
            return response.json();
        });
}