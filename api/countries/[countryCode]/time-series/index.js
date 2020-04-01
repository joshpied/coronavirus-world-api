import axios from 'axios';
import { csv } from 'csvtojson';
import { formatToCountryObj } from '../../../_utils';
import { getCountryNameByCode } from '../../../_utils/countries';

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
    const response = await axios.all([
      confirmedPromise,
      deceasedPromise,
      recoveredPromise
    ]);

    const [confirmedCases, deceasedCases, recoveredCases] = await Promise.all([
      convertCSVtoObj(response[0].data),
      convertCSVtoObj(response[1].data),
      convertCSVtoObj(response[2].data)
    ]);

    const { countryCode } = req.query;
    const countryNameAndCode = getCountryNameByCode(countryCode);
    // return error output if not a valid country code
    if (!countryNameAndCode)
      res
        .status(404)
        .json({ success: false, message: 'Country code not found.' });
    // return error output when theres no data avilable for a country
    else if (!confirmedCases.hasOwnProperty(countryNameAndCode.name))
      res.status(404).json({
        success: false,
        message: `No data available for ${countryNameAndCode.name}`
      });
    else {
      // format final return object
      const country = {
        ...countryNameAndCode,
        coordinates: confirmedCases[countryNameAndCode.name].coordinates,
        confirmedDates: confirmedCases[countryNameAndCode.name].dates,
        deceasedDates: deceasedCases[countryNameAndCode.name].dates,
        recoveredDates: recoveredCases[countryNameAndCode.name].dates
      };

      res.status(200).json({
        success: true,
        country
      });
    }
  } catch (e) {
    console.log(e);
  }
};
