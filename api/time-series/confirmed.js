const axios = require('axios');
const csv = require('csvtojson');

module.exports = async (req, res) => {
  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  try {
    const response = await axios.get(url);
    const statsCsvString = response.data;
    const stats = await csv().fromString(statsCsvString);
    const formattedStatsObj = {};

    for (let i in stats) {
      const countryName = stats[i]['Country/Region'];

      if (countryName in formattedStatsObj) {
        // console.log(countryName, stats[i]['3/22/20']);
        for (let dateKey in formattedStatsObj[countryName]) {
          if (dateKey !== 'coordinates') {
            formattedStatsObj[countryName][dateKey] += parseInt(
              stats[i][dateKey]
            );
          }
        }
      }
      // formattedStatsObj[countryName] = stats[i];
      else {
        formattedStatsObj[countryName] = stats[i];
        const coordinates = {
          latitude: parseFloat(formattedStatsObj[countryName]['Lat']),
          longitude: parseFloat(formattedStatsObj[countryName]['Long'])
        };
        formattedStatsObj[countryName]['coordinates'] = coordinates;
        delete formattedStatsObj[countryName]['Country/Region'];
        delete formattedStatsObj[countryName]['Province/State'];
        delete formattedStatsObj[countryName]['Lat'];
        delete formattedStatsObj[countryName]['Long'];
        for (let dateKey in formattedStatsObj[countryName]) {
          if (dateKey !== 'coordinates')
            formattedStatsObj[countryName][dateKey] = parseInt(
              formattedStatsObj[countryName][dateKey]
            );
        }
      }
    }

    // console.log(formattedStatsObj['Afghanistan'][]);

    res.status(200).json({
      countries: formattedStatsObj, //[stats[0], stats[1]],
      length: Object.keys(formattedStatsObj).length,
      success: true
    });
  } catch (e) {
    console.log(e);
  }
};
