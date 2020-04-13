import axios from 'axios';
import { csv } from 'csvtojson';
import { convertTotalsToNewCases, formatToCountryObj } from '../../../_utils';

module.exports = async (req, res) => {
  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  try {
    const response = await axios.get(url);
    const statsCsvString = response.data;
    const stats = await csv().fromString(statsCsvString);
    const formattedStatsObj = formatToCountryObj(stats);
    const newCasesByCountry = convertTotalsToNewCases(formattedStatsObj);

    res.status(200).json({
      countries: newCasesByCountry,
      length: Object.keys(formattedStatsObj).length,
      success: true
    });
  } catch (e) {
    console.log(e);
  }
};
