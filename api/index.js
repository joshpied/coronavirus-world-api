module.exports = async (req, res) => {
  res.status(200).json({
    '/time-series': {
      '/confirmed': {
        route: 'https://coronavirus-world-api.now.sh/api/time-series/confirmed',
        '/new': {
          route:
            'https://coronavirus-world-api.now.sh/api/time-series/confirmed/new'
        }
      },
      '/deceased': {
        route: 'https://coronavirus-world-api.now.sh/api/time-series/deceased',
        '/new': {
          route:
            'https://coronavirus-world-api.now.sh/api/time-series/deceased/new'
        }
      }
    }
  });
};
