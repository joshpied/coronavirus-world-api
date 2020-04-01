module.exports = async (req, res) => {
  res.status(200).json({
    '/countries': {
      route: 'https://coronavirus-world-api.now.sh/api/countries',
      '/[countryCode]': {
        route: 'https://coronavirus-world-api.now.sh/api/countries/ca',
        'time-series': {
          route:
            'https://coronavirus-world-api.now.sh/api/countries/ca/time-series',
          confirmed: {
            route:
              'https://coronavirus-world-api.now.sh/api/countries/ca/time-series/confirmed'
          },
          deceased: {
            route:
              'https://coronavirus-world-api.now.sh/api/countries/ca/time-series/deceased'
          },
          recovered: {
            route:
              'https://coronavirus-world-api.now.sh/api/countries/ca/time-series/recovered'
          }
        }
      }
    },
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
