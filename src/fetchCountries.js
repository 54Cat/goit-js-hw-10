const url = 'https://restcountries.com/v2';
const filter = ['name', 'capital', 'population', 'flags', 'languages'];
const filterResponse = filter.join(",");

export default class CountryApiService {
    constructor() { }

    fetchCountry(searchedCountry) {
        return fetch(`${url}/name/${searchedCountry}?fields=${filterResponse}`)
            .then(response => {
                // if (!response.ok) {
                //     throw new Error(response.status);
                // }
                return response.json();
            });
    } 
}