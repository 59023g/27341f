var _         = require('lodash'),
  request     = require('request'),
  fs          = require('fs'),
  q           = require('q');

var startDate = '2007-01-14',
  endDate     = '2015-11-01',
  url         = 'https://www.quandl.com/api/v3/datasets/YAHOO/INDEX_DJI.json?collapse=monthly&start_date=' + startDate + '&end_date=' + endDate,
  djiaStore   = 'djia_start_date=' + startDate + '&end_date=' + endDate + '.json';


var data = {
  processData: function(dataFile) {
    // todo - async issue here when GET, but not if existing
    console.log(JSON.parse(fs.readFileSync(dataFile, 'utf8')))
  },
  get: function() {
    var deferred = q.defer();
    fs.stat(djiaStore, function(err, stat) {
      if (err === null) {
        deferred.resolve(djiaStore);
      } else {
        request({
            method: 'GET',
            uri: url
          })
          .on('error', function(err) {
            deferred.reject(err)
          })
          .on('response', function(response) {
            console.log('response')
            response.pipe(fs.createWriteStream(djiaStore))
          })
          .on('end', function(response) {
            console.log('end')
            deferred.resolve(djiaStore)
          })
      }

      // https://github.com/Olical/react-faux-dom
      // http://oli.me.uk/2015/09/09/d3-within-react-the-right-way/
    });
    return deferred.promise;

  }
};

data.get().then(function(res) {
  data.processData(res);
});

module.exports = data;
