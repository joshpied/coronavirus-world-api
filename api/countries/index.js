import axios from 'axios';
import { csv } from 'csvtojson';
import { formatToCountryObj, getLastObject, getLastObjectKey } from '../_utils';
import { getCountryByName } from '../_utils/countries';

async function convertCSVtoObj(csvString) {
  const stats = await csv().fromString(csvString);
  const countriesObj = formatToCountryObj(stats);
  return countriesObj;
}

module.exports = async (req, res) => {
  const confirmedPromise = axios.get(
    `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`
  );
  const deceasedPromise = axios.get(
    `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv`
  );
  const recoveredPromise = axios.get(
    `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv`
  );

  try {
    // complete time series for each statistic, for every country
    const response = await axios.all([
      confirmedPromise,
      deceasedPromise,
      recoveredPromise
    ]);

    // format to object of country objects with country name as the key
    // still 3 different objs for each stats
    const [confirmedCases, deceasedCases, recoveredCases] = await Promise.all([
      convertCSVtoObj(response[0].data),
      convertCSVtoObj(response[1].data),
      convertCSVtoObj(response[2].data)
    ]);

    // merge stats into a single array by going through each country name,
    // getting the latest date total for each stat
    const countries = Object.keys(confirmedCases)
      .map(countryName => ({
        ...getCountryByName(countryName),
        coordinates: confirmedCases[countryName].coordinates,
        stats: {
          confirmed: getLastObject(confirmedCases[countryName].dates),
          deceased: getLastObject(deceasedCases[countryName].dates),
          recovered: getLastObject(recoveredCases[countryName].dates),
          lastUpdated: getLastObjectKey(confirmedCases[countryName].dates)
        }
      }))
      .filter(country => country.hasOwnProperty('code')); // remove countries that have only have country code (i.e. cruise ships)

    res.status(200).json({
      success: true,
      length: countries.length,
      countries
    });
  } catch (e) {
    console.log(e);
  }
};
