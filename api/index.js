module.exports = async (req, res) => {
  res.status(200).json({
    'Time Series': {
      confirmed: 'https://coronavirus-world-api.now.sh/api/time-series/confirmed',
      deceased: 'https://coronavirus-world-api.now.sh/api/time-series/deceased'
    }
  });
};
