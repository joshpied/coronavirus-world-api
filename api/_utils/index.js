import dayjs from 'dayjs';

export const convertTotalsToNewCases = (countriesObj) => {
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

export const formatToCountryObj = (stats) => {
  const formattedStatsObj = {};

  // inserts a country to final return object with the country name as a key and country coordinates and stats in the value
  const addCountryToObj = (i, countryName) => {
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
  };

  for (let i in stats) {
    const countryName = stats[i]['Country/Region'];

    // 1. if has no 'Province/State' -> add full country to formattedStatsObj
    // 2. if has 'Province/State' AND if 'Country/Region' is Australia, Canada, or China -> check if already in object, if yes increment counts, 
    //    otherwise make new entry into formattedStatsObj
    // 3. if has 'Province/State' AND any other country -> make new entry into formattedStatsObj

    // 1
    if (stats[i]['Province/State'] === '') {
      addCountryToObj(i, countryName);
    } else {
      // 2. These three countries have several entries
      if (
        ['Australia', 'Canada', 'China'].includes(stats[i]['Country/Region'])
      ) {
        if (countryName in formattedStatsObj) {
          for (let dateKey in formattedStatsObj[countryName]['dates']) {
            formattedStatsObj[countryName]['dates'][dateKey] += parseInt(
              stats[i][dateKey]
            );
          }
          // The country still needs to be added to final return objectZ
        } else {
          addCountryToObj(i, countryName);
        }
      }
      // 3. Overseas territores that belong to other countries (Greenland - Denmark, Guadeloupe - France, etc.)
      else {
        const provinceName = stats[i]['Province/State']; // init new country using the province name (eg. will contain 'Greenland', not 'Denmark')
        addCountryToObj(i, provinceName);
      }
    }
  }

  return formattedStatsObj;
};

/**
 * Returns the value of the last stored item in an object by turning it into an array with Object.keys
 * @param {*} obj
 */
export const getLastObject = (obj) => {
  return obj[Object.keys(obj)[Object.keys(obj).length - 1]];
};

/**
 * Returns the key of the last stored item in an object by turning it into an array with Object.keys
 * @param {*} obj
 */
export const getLastObjectKey = (obj) => {
  return Object.keys(obj)[Object.keys(obj).length - 1];
};

/**
 * Takes an array of daily stats and sums the total cases for the specified day
 * @param {array} stats array of objects from csv for daily recovered, deceased, confirmed cases
 * @param {string} date string formatted as 'm/d/y'
 */
export const dailyStatSum = (stats, date) => {
  return stats
    .map((stat) => parseInt(stat[date]))
    .reduce((prev, next) => prev + next);
};

/**
 * If today's date in object, can return that date, otherwise return yesterday's date
 * @param {Object} statObj object representing one line from raw csv to extract most recent date from
 */
export const getMostRecentDate = (statObj) => {
  const today = dayjs().format('M/D/YY');
  if (statObj.hasOwnProperty(today)) return today;
  return dayjs().subtract(1, 'day').format('M/D/YY');
};
