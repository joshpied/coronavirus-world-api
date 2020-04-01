import { countries } from '../_utils/countries';

module.exports = async (req, res) => {
  res.status(200).json({
    success: true,
    length: countries.length,
    countries: countries
  });
};
