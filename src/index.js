import './css/styles.css';
import { fetchCountries } from './js/fetchcountry';
import _debounce from 'lodash.debounce';
import Notiflix from 'notiflix';



const DEBOUNCE_DELAY = 300

const countryInput = document.querySelector('#search-box')
const countryList = document.querySelector('.country-list')
const countryInfo = document.querySelector('.country-info')
const getMap = document.querySelector('#map')
const listMess = document.querySelector('#listmessage')



countryInput.addEventListener('input', _debounce(onCountryInput, DEBOUNCE_DELAY))
countryList.addEventListener('click', checkClick)

function onCountryInput() {
  const name = countryInput.value.trim()

  if (name === '') {
    listMess.className = "hideitem";

    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '')
  }
getCountry(name)
}

function getCountry(name){

  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = ''
      countryInfo.innerHTML = ''
      getMap.remove()
      if (countries.length === 1) {
        listMess.className = "hideitem";
        //countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries))
 renderCountryInfo(countries) 

      } else if (countries.length >= 10) {        
        listMess.className = "hideitem";
        alertTooManyMatches()
      
      } else {
      renderCountryList(countries)
    
      }
    })
    .catch(alertWrongName)
}

function renderCountryList(countries) {
  listMess.className = "showitem";
  const markup = countries
  .map((country) => {
    const makeli = document.createElement('li');
    makeli.innerHTML= `
    <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width = 150px>
    <h2 style = "width:200px">${country.name.official}</h2>
   `

   countryList.append(makeli)
  })
  stylepage()
}

function renderCountryInfo(countries) {
  listMess.className = "hideitem";
  const markup = countries.map((country) => {
    const numberPop = +country.population 
    let li =''    
     const ul = document.createElement('ul')
     ul.style.display = 'flex';
     ul.style.listStyleType = 'none';
     ul.style.flexDirection =  'column';
li = document.createElement('li')
li.style.display = 'flex';
li.innerHTML= `<img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width = 200px>`
ul.appendChild(li)
li = document.createElement('li')
li.style.display = 'flex';
li.innerHTML= `<h2>${country.name.official}</h2>`
ul.appendChild(li)   
li = document.createElement('li')
li.style.display = 'flex';
li.style.alignItems = 'center';
li.innerHTML= `<h3 style="padding-right: 10px">Capital:</h3> <p>${country.capital}</p>`
ul.appendChild(li)  
li = document.createElement('li')
li.style.display = 'flex';
li.style.alignItems = 'center';
li.innerHTML= `<h3 style="padding-right: 10px">Languages: </h3> <p>${Object.values(country.languages).join(', ')}</p>`
ul.appendChild(li)
li = document.createElement('li')
li.style.alignItems = 'center';
li.style.display = 'flex';
li.innerHTML= `<h3 style="padding-right: 10px">Population: </h3> <p>${numberPop.toLocaleString("en-US")}</p>`
    ul.appendChild(li)

countryInfo.append(ul)
const createmsapdiv = document.createElement('div')
createmsapdiv.setAttribute('id','map')
countryInfo.append(createmsapdiv)



    var map = L.map('map').setView([country.latlng[0], country.latlng[1]], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
 
var marker = L.marker([country.latlng[0], country.latlng[1]],{title: country.name.official}).addTo(map);

     })
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name')
}

function alertTooManyMatches() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
}

function stylepage(){

  countryList.style.display = 'flex';
  countryList.style.flexWrap = 'wrap';
  countryList.style.listStyleType = 'none';
  allLI = countryList.childNodes
}


function checkClick(e){
  const itemClicked = e.target.nodeName
  if (itemClicked !== 'IMG' && itemClicked !== 'H2'){
     return}
   const allChildren = e.target.parentElement.childNodes 
   let findCountry=""
for (let i = 0; i < allChildren.length;i++){
if (allChildren[i].nodeName==="H2"){
  findCountry = allChildren[i].textContent
}
}
if   (findCountry !== ""){
  getCountry(findCountry)
}


  }
