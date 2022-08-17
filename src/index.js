import './css/styles.css';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import CountryApiService from './fetchCountries';

const input = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
const responseSize = 10;

input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

const countryApiService = new CountryApiService();

function onSearchCountry(e) {
    e.preventDefault();

    const search = e.target.value;
    const searchedCountry = search.trim();

    if (searchedCountry === '') {
        onClearCountryList();
        onClearCountryInfo();
    }
    else {
        countryApiService.fetchCountry(searchedCountry)
            .then(data => insertContent(data))
            .catch(error => console.log(error));  
    }
}

function insertContent(countries) {

    if (countries.length === undefined) { 
        onShowNotifyError();
        onClearCountryInfo();
        onClearCountryList();
    }
    else if (countries.length === 1) {
        onCreateCountriesList(countries); 
        onCreateCountryInfo(countries);
    }
    else if (countries.length > 1 & countries.length <= responseSize) {
        onCreateCountriesList(countries);
        onClearCountryInfo();
    }
    else if (countries.length > responseSize) {
        onClearCountryInfo();
        onClearCountryList();
        onShowNotifyOverflow();
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
    const { capital, population, languages } = country[0];
    const language = languages.map(list => list.name).join(', ');
    const info = `
    <ul class="country-info-list">
        <li class="country-info-item"><span>Capital:</span>${capital}</li>
        <li class="country-info-item"><span>Population:</span>${population}</li>
        <li class="country-info-item"><span>Languages:</span>${language}</li>
    </ul>`;
    countryInfoEl.insertAdjacentHTML('beforeend', info);
};

function onClearCountryList() {
    countryListEl.innerHTML = '';
}
function onClearCountryInfo() {
    countryInfoEl.innerHTML = '';
}

function onShowNotifyError() {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onShowNotifyOverflow() {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}