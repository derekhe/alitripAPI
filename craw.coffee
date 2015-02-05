request = require('request').defaults(jar: true)
md5 = require('MD5')
moment = require('moment')
_ = require('lodash')
citylist = require('./citylist').data.hotCity

getUrl = (session, time, dep, arr, date) ->
  apiKey = '12574478'
  req = '{"searchType":"1","depCityCode":"' + dep + '","arrCityCode":"' + arr + '","leaveDate":"' + date + '","backDate":"' + date + '","itineraryFilter":"0","sellerIds":"","leaveFlightNo":"","leaveCabinClass":"0","backCabinClass":"0","utdid":"","depDate":"' + date + '"}'
  sign = md5(session + '&' + time + '&' + apiKey + '&' + req)
  url = 'http://api.m.taobao.com/rest/h5ApiUpdate.do?api=mtop.trip.flight.flightSuperSearch&v=1.0&data=' + req + '&useNative=true&ttid=201300@travel_h5_3.1.0&appKey=12574478&t=' + time + '&sign=' + sign

j = request.jar()
url = getUrl()
request.get {
  url: url
  jar: j
}, (err, res, body) ->
  b = JSON.parse(body)
  if b.ret[0] == 'FAIL_SYS_TOKEN_EMPTY::令牌为空'
    tmp = j.getCookieString(url).split(';')[0].substring(9).split('_')
    token = tmp[0]
    time = tmp[1]
    count = 0
    _.each citylist, (dep) ->
      _.each citylist, (arr) ->
        if dep == arr
          return
        _.each _.range(1, 30), (i) ->
          date = moment().add(i, 'days').format('YYYY-MM-DD')
          u = getUrl(token, time, dep.code, arr.code, date)
          request.get {
            url: u
            jar: j
          }, (err, res, body) ->
            b = JSON.parse(body)
            console.log count, dep.cityName, arr.cityName, date, b.ret, _.size(b.data.ow_flight)
            count++
            return
          return
        return
      return
  return