 function fetchCountries(typeContry) {
    const fetchURL = "https://restcountries.com/v3.1/name/"
    const returnFields = "?fields=name,capital,population,flags,languages,latlng,maps"
    return fetch(fetchURL+typeContry+returnFields)
  .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });
    }

export{fetchCountries}