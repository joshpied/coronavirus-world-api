export const convertTotalsToNewCases = countriesObj => {
  for (let country in countriesObj) {
    let previousDayTotal = 'init';
    for (let dateKey in countriesObj[country]) {
      if (dateKey !== 'coordinates') {
        if (previousDayTotal === 'init') {
          previousDayTotal = countriesObj[country][dateKey];
        } else {
          const currentDayTotal = countriesObj[country][dateKey];
          countriesObj[country][dateKey] = currentDayTotal - previousDayTotal;
          previousDayTotal = currentDayTotal;
        }
      }
    }
  }

  return countriesObj;
};
