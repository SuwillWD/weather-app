import './styles.css';

async function getWeatherData(location) {
  let url =
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' +
    location +
    '?key=WSWAVFESEW8P8EA8PB7QBTRCH';
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

async function processWeatherData(location) {
  let rawData = await getWeatherData(location);

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

processWeatherData('nagpur').then((response) => {
  console.log(response.sevenDaysForcast);
});
