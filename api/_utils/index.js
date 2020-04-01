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

export const getLastObject = obj => {
  return obj[Object.keys(obj)[Object.keys(obj).length - 1]];
};
