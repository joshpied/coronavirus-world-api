module.exports = async (req, res) => {
  res.status(200).json({
    '/world': {
      route: 'https://coronavirus-world-api.now.sh/api/world'
    },
    '/country': {
      route: 'https://coronavirus-world-api.now.sh/api/country',
      '/[countryCode]': {
        route: 'https://coronavirus-world-api.now.sh/api/country/ca',
        '/time-series': {
          route:
            'https://coronavirus-world-api.now.sh/api/country/ca/time-series',
          '/confirmed': {
            route:
              'https://coronavirus-world-api.now.sh/api/country/ca/time-series/confirmed'
          },
          '/deceased': {
            route:
              'https://coronavirus-world-api.now.sh/api/country/ca/time-series/deceased'
          },
          '/recovered': {
            route:
              'https://coronavirus-world-api.now.sh/api/country/ca/time-series/recovered'
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
