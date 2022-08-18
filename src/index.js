import './css/styles.css';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import CountryApiService from './fetchCountries';

const input = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
const RESPONSE_SIZE = 10;

input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
    e.preventDefault();

    const searchedCountry = e.target.value.trim();

    if (searchedCountry === '') {
        removeData();
    }
    else {
        CountryApiService(searchedCountry)
            .then(data => insertContent(data))
            .catch(error => {
                if (error.code === 404) {
                    notFound()
                    removeData();
                }
                else {
                    unknownError();
                }
            });  
    }
}

function insertContent(countries) {
    removeData();

    if (countries.length === 1) {
        onCreateCountryInfo(countries);
    }
    else if (countries.length > 1 & countries.length <= RESPONSE_SIZE) {
        onCreateCountriesList(countries);
    }
    else {
        manyCountriesError();
    }
}

function onCreateCountriesList(countries) { 
    countryListEl.innerHTML = listCountry(countries);
}

const listCountry = (list) => list.reduce((acc, country) => acc + markupCountryList(country), []);

function markupCountryList ({ name, flags }) {
    return `<li class="country">
    <img src='${flags.svg}' alt='Flag ${name}'>${name}</li>`;
};

function onCreateCountryInfo(country) {
    const { name, flags, capital, population, languages } = country[0];
    const language = languages.map(list => list.name).join(', ');
    const selectedCountry = `<li class="country selected">
    <img src='${flags.svg}' alt='Flag ${name}'>${name}</li>`;
    const info = `
    <ul class="country-info-list">
        <li class="country-info-item"><span>Capital:</span>${capital}</li>
        <li class="country-info-item"><span>Population:</span>${population}</li>
        <li class="country-info-item"><span>Languages:</span>${language}</li>
    </ul>`;
    countryListEl.innerHTML = selectedCountry;
    countryInfoEl.insertAdjacentHTML('beforeend', info);
};

function removeData() {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
}

function notFound() {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}

function manyCountriesError() {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function unknownError() {
    Notiflix.Notify.info('Unknown error has occurred');
}