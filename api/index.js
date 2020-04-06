module.exports = async (req, res) => {
  res.status(200).json({
    '/world': {
      route: 'https://coronavirus-world-api.now.sh/api/world'
    },
    '/country': {
      route: 'https://coronavirus-world-api.now.sh/api/country',
      description: 'List of countries and codes available to use',
      '/[countryCode]': {
        route: 'https://coronavirus-world-api.now.sh/api/country/ca',
        description:
          "Country's most recent confirmed cases, deceased, and recovered stats. Optional query param of detailed=true to get time series for all stats",
        '/time-series': {
          route:
            'https://coronavirus-world-api.now.sh/api/country/ca/time-series',
          description: 'Time series for all three statistics of a country',
          '/confirmed': {
            route:
              'https://coronavirus-world-api.now.sh/api/country/ca/time-series/confirmed',
            description: 'Daily count of confirmed cases'
          },
          '/deceased': {
            route:
              'https://coronavirus-world-api.now.sh/api/country/ca/time-series/deceased',
            description: 'Daily count of deceased cases for a country'
          },
          '/recovered': {
            route:
              'https://coronavirus-world-api.now.sh/api/country/ca/time-series/recovered',
            description: 'Daily count of recovered cases'
          }
        }
      }
    },
    '/countries': {
      route: 'https://coronavirus-world-api.now.sh/api/countries',
      description:
        'Most recent confirmed cases, deceased, and recovered stats for each country',
      '/time-series': {
        '/confirmed': {
          route:
            'https://coronavirus-world-api.now.sh/api/countries/time-series/confirmed',
          description: 'Daily count of confirmed cases for all countries',
          '/new': {
            route:
              'https://coronavirus-world-api.now.sh/api/countries/time-series/confirmed/new',
            description:
              'Daily increase case count from previous day cases for all countries'
          }
        },
        '/deceased': {
          route:
            'https://coronavirus-world-api.now.sh/api/countries/time-series/deceased',
          description: 'Daily count of deceased cases for all countries',
          '/new': {
            route:
              'https://coronavirus-world-api.now.sh/api/countries/time-series/deceased/new',
            description:
              'Daily increase count in deaths from previous day for all countries'
          }
        }
      }
    }
  });
};
