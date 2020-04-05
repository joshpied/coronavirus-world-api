import dayjs from 'dayjs';

export const convertTotalsToNewCases = countriesObj => {
  for (let country in countriesObj) {
    let previousDayTotal = 'init';
    for (let dateKey in countriesObj[country]['dates']) {
      if (previousDayTotal === 'init') {
        previousDayTotal = countriesObj[country]['dates'][dateKey];
      } else {
        const currentDayTotal = countriesObj[country]['dates'][dateKey];
        countriesObj[country]['dates'][dateKey] =
          currentDayTotal - previousDayTotal;
        previousDayTotal = currentDayTotal;
      }
    }
  }

  return countriesObj;
};

export const formatToCountryObj = stats => {
  const formattedStatsObj = {};

  for (let i in stats) {
    const countryName = stats[i]['Country/Region'];

    // countries with regional data: increment the count
    if (countryName in formattedStatsObj) {
      for (let dateKey in formattedStatsObj[countryName]['dates']) {
        formattedStatsObj[countryName]['dates'][dateKey] += parseInt(
          stats[i][dateKey]
        );
      }
      // countries added to obj here (countries without regional data will only use this part)
    } else {
      formattedStatsObj[countryName] = { ...stats[i] }; // init new country
      // add geo coordinates property to new country object
      const coordinates = {
        latitude: parseFloat(formattedStatsObj[countryName]['Lat']),
        longitude: parseFloat(formattedStatsObj[countryName]['Long'])
      };
      formattedStatsObj[countryName]['coordinates'] = coordinates;
      // remove data no longer needed
      delete formattedStatsObj[countryName]['Country/Region'];
      delete formattedStatsObj[countryName]['Province/State'];
      delete formattedStatsObj[countryName]['Lat'];
      delete formattedStatsObj[countryName]['Long'];
      formattedStatsObj[countryName]['dates'] = {};
      // put every 'date': 'amount' pair in a new dates property and make them integers
      for (let dateKey in stats[i]) {
        if (
          !['Lat', 'Long', 'Province/State', 'Country/Region'].includes(dateKey)
        ) {
          formattedStatsObj[countryName]['dates'][dateKey] = parseInt(
            stats[i][dateKey]
          );
          delete formattedStatsObj[countryName][dateKey];
        }
      }
    }
  }

  return formattedStatsObj;
};

/**
 * Returns the value of the last stored item in an object by turning it into an array with Object.keys
 * @param {*} obj 
 */
export const getLastObject = obj => {
  return obj[Object.keys(obj)[Object.keys(obj).length - 1]];
};

/**
 * Returns the key of the last stored item in an object by turning it into an array with Object.keys
 * @param {*} obj 
 */
export const getLastObjectKey = obj => {
  return Object.keys(obj)[Object.keys(obj).length - 1];
};

/**
 * Takes an array of daily stats and sums the total cases for the specified day
 * @param {array} stats array of objects from csv for daily recovered, deceased, confirmed cases
 * @param {string} date string formatted as 'm/d/y'
 */
export const dailyStatSum = (stats, date) => {
  return stats
    .map(stat => parseInt(stat[date]))
    .reduce((prev, next) => prev + next);
};

/**
 * If today's date in object, can return that date, otherwise return yesterday's date
 * @param {Object} statObj object representing one line from raw csv to extract most recent date from
 */
export const getMostRecentDate = statObj => {
  const today = dayjs().format('M/D/YY');
  if (statObj.hasOwnProperty(today)) return today;
  return dayjs()
    .subtract(1, 'day')
    .format('M/D/YY');
};
