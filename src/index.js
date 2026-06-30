import './styles.css';

async function getWeatherData(location) {
  try {
    let url =
      'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' +
      location +
      '?key=WSWAVFESEW8P8EA8PB7QBTRCH';
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid Request!`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function processWeatherData(location) {
  let rawData = await getWeatherData(location);

  if (rawData instanceof Error) {
    // Todo - handle invalid request functions
    return;
  }

  function pick(obj, keys) {
    return Object.fromEntries(keys.map((key) => [key, obj[key]]));
  }

  let currentConditions = pick(rawData.currentConditions, [
    'conditions',
    'datetime',
    'humidity',
    'icon',
    'pressure',
    'sunrise',
    'sunset',
    'temp',
    'visibility',
    'windspeed',
  ]);

  let sevenDaysForcast = [];

  for (let i = 0; i < 7; i++) {
    sevenDaysForcast.push(
      pick(rawData.days[i], [
        'conditions',
        'datetime',
        'humidity',
        'icon',
        'pressure',
        'sunrise',
        'sunset',
        'temp',
        'tempmax',
        'tempmin',
        'visibility',
        'windspeed',
      ])
    );
  }

  const description = rawData.description;
  const timezone = rawData.timezone;

  return {
    location,
    currentConditions,
    sevenDaysForcast,
    description,
    timezone,
  };
}

function validateForm(form) {
  let inputValue = form.children[0];
  if (inputValue.validity.valueMissing) {
    inputValue.setCustomValidity('Please enter a location.');
    inputValue.reportValidity();
    return false;
  } else {
    inputValue.setCustomValidity('');
    return true;
  }
}

const handleUserRequests = (() => {
  const homeForm = document.getElementById('home-form');

  homeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm(homeForm)) {
      return;
    }
    const searchValue = document.getElementById('home-input').value;
    let newData = await processWeatherData(searchValue);
    console.log(newData.description);
    homeForm.reset();
  });
})();
