'use strict';

const apiKey = 'rHtS0gM9yKaoPQv2HSZonQ1LBR6k1axHLSSKU7LC';

const searchURL = 'https://developer.nps.gov/api/v1/parks/';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#js-results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    $('#js-results-list').append(
      `<li><h3>${responseJson.data[i].name}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href = "${responseJson.data[i].url}">${responseJson.data[i].url}</a>
      </li>`
    )};  
  $('.results').removeClass('hidden');
};

function getParks(pickState, maxResults=10) {
  const params = {
    api_key: apiKey,
    stateCode: pickState,
    limit: maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
        if(responseJson.total = 0) {
          $("js-error-message").text("Parks not available. Try again.");  
        } 
        else {displayResults(responseJson)};
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchState = $('#js-search-state').val();
    const pickState = searchState.replace(/\s+/g, '&statecode=');
    const maxResults = $('#js-max-results').val();
    getParks(pickState, maxResults);
  });
}

$(watchForm);