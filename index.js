const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

fetchButton.addEventListener('click', () => {
  const state = stateInput.value.trim().toUpperCase();
  
  if (state === '') {
    showError('Please enter a state abbreviation');
    return;
  }

  fetchWeatherAlerts(state);
});

function fetchWeatherAlerts(state) {
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';        // clear error text
  alertsDisplay.innerHTML = '<p>Loading...</p>';

  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch weather alerts');
      return response.json();
    })
    .then(data => {
      displayAlerts(data, state);
      stateInput.value = '';
    })
    .catch(error => {
      showError(error.message || 'Network issue');
    });
}

function displayAlerts(data, state) {
  alertsDisplay.innerHTML = '';

  const numAlerts = data.features ? data.features.length : 0;
  
  // Test expects this exact title format
  const titleEl = document.createElement('h2');
  titleEl.textContent = `Weather Alerts: ${numAlerts}`;
  alertsDisplay.appendChild(titleEl);

  if (numAlerts === 0) {
    const p = document.createElement('p');
    p.textContent = 'No active alerts at this time.';
    alertsDisplay.appendChild(p);
    return;
  }

  const ul = document.createElement('ul');
  data.features.forEach(alert => {
    const li = document.createElement('li');
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });

  alertsDisplay.appendChild(ul);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  alertsDisplay.innerHTML = '';
}