var expect = require('chai').expect,
    api = require('../alitrip');

var moment = require('moment');

it("Should get flights", function (done) {
    api.getFlight("CTU", "CAN", moment().add(5, 'days').format('YYYY-MM-DD')).then(function (b) {
        expect(b.ret[0]).to.equal('SUCCESS::调用成功');
        expect(b.data.ow_flight.length).to.be.at.least(10);

        done();
    }).catch(function (e) {
        done(e);
    });
});