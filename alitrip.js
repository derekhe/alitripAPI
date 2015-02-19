(function () {
    var request = require('request').defaults({
        jar: true
    });
    var md5 = require('MD5');
    var Q = require('q');

    var getUrl = function (session, time, dep, arr, date) {
        var apiKey = '12574478';
        var req = '{"searchType":"1","depCityCode":"' + dep + '","arrCityCode":"' + arr + '","leaveDate":"' + date + '","backDate":"' + date + '","itineraryFilter":"0","sellerIds":"","leaveFlightNo":"","leaveCabinClass":"0","backCabinClass":"0","utdid":"","depDate":"' + date + '"}';
        var sign = md5(session + '&' + time + '&' + apiKey + '&' + req);

        return 'http://api.m.taobao.com/rest/h5ApiUpdate.do?api=mtop.trip.flight.flightSuperSearch&v=1.0&data=' + req + '&useNative=true&ttid=201300@travel_h5_3.1.0&appKey=12574478&t=' + time + '&sign=' + sign;
    };

    var token, time;
    var j = request.jar();

    var getFlight = function (departureAirportCode, arriveAirportCode, date) {
        var deferred = Q.defer();

        var url = getUrl(token, time, departureAirportCode, arriveAirportCode, date)
        request.get({
            url: url,
            jar: j
        }, function (err, res, body) {
            var b = JSON.parse(body);

            if (b.ret[0] === 'FAIL_SYS_TOKEN_EMPTY::令牌为空') {
                var cookie = j.getCookieString(url).split(';')[0].substring(9).split('_');
                token = cookie[0];
                time = cookie[1];

                request.get({
                    url: getUrl(token, time, departureAirportCode, arriveAirportCode, date),
                    jar: j
                }, function (err, res, body) {
                    b = JSON.parse(body);
                    deferred.resolve(b);
                }, function (err) {
                    deferred.reject(err);
                });
            }
            else {
                deferred.resolve(b);
            }
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    exports.getFlight = getFlight;
})();