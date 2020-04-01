import axios from 'axios';
import { csv } from 'csvtojson';
import { formatToCountryObj } from '../../_utils';
import { getCountryNameByCode } from '../../_utils/countries';

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

  // 1. promise all,
  // 2. run all three res's through function to get latest value from dates
  // 3. format three stats in stats obj in final response
  try {
    const response = await axios.all([
      confirmedPromise,
      deceasedPromise,
      recoveredPromise
    ]);
    // console.log(response.data);

    const [confirmedCases, deceasedCases, recoveredCases] = await Promise.all([
      convertCSVtoObj(response[0].data),
      convertCSVtoObj(response[1].data),
      convertCSVtoObj(response[2].data)
    ]);
    // console.log(confi)

    res.status(200).json({
      success: true,
      length: Object.keys(confirmedCases).length,
      country: confirmedCases
    });
  } catch (e) {
    console.log(e);
  }
};

// module.exports = async (req, res) => {
//   const confirmedUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
//   const deceasedUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv`;
//   const recoveredUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv`;

//   // 1. promise all,
//   // 2. run all three res's through function to get latest value from dates
//   // 3. format three stats in stats obj in final response
//   try {
//     const response = await axios.get(confirmedUrl);
//     const statsCsvString = response.data;
//     const stats = await csv().fromString(statsCsvString);
//     const allCountriesObj = formatToCountryObj(stats);
//     const { countryCode } = req.query;
//     const countryNameAndCode = getCountryNameByCode(countryCode);

//     const countryObj = { ...countryNameAndCode, ...allCountriesObj[country.name] };

//     res.status(200).json({
//       country: countryObj,
//       success: true
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };
