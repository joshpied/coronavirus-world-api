module.exports = async (req, res) => {
  res.status(200).json({
    'Time Series': {
      confirmed: 'https://coronavirus-world-api.now.sh/time-series/confirmed',
      deceased: 'https://coronavirus-world-api.now.sh/time-series/deceased'
    }
  });
};
