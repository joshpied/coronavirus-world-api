import axios from 'axios';
import { csv } from 'csvtojson';
import { dailyStatSum, getMostRecentDate } from '../_utils';

async function convertCsvToArray(csvString) {
  const data = await csv().fromString(csvString);
  return data;
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
    const responses = await axios.all([
      confirmedPromise,
      deceasedPromise,
      recoveredPromise
    ]);

    const stats = await Promise.all(
      responses.map(response => convertCsvToArray(response.data))
    );

    const lastUpdated = getMostRecentDate(stats[0][0]);

    const [cases, deceased, recovered] = stats.map(stat =>
      dailyStatSum(stat, lastUpdated)
    );

    res.status(200).json({
      currentStats: { cases, deceased, recovered, lastUpdated },
      success: true
    });
  } catch (e) {
    console.log(e);
  }
};
