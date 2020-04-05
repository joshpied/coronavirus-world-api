import axios from 'axios';
import { csv } from 'csvtojson';
import { formatToCountryObj } from '../../../_utils';
import { getCountryNameByCode } from '../../../_utils/countries';

module.exports = async (req, res) => {
  const recoveredUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv`;

  try {
    const response = await axios.get(recoveredUrl);
    const statsCsvString = response.data;
    const stats = await csv().fromString(statsCsvString);
    const allCountriesObj = formatToCountryObj(stats);
    const { countryCode } = req.query;
    const countryNameAndCode = getCountryNameByCode(countryCode);

    if (!countryNameAndCode)
      res
        .status(404)
        .json({ success: false, messages: 'Country code not found.' });
    // return error output when theres no data avilable for a country
    else if (!allCountriesObj.hasOwnProperty(countryNameAndCode.name))
      res.status(404).json({
        success: false,
        message: `No data available for ${countryNameAndCode.name}`
      });
    else {
      const country = {
        ...countryNameAndCode,
        ...allCountriesObj[countryNameAndCode.name]
      };

      res.status(200).json({
        country,
        success: true
      });
    }
  } catch (e) {
    console.log(e);
  }
};
