var bond = require('bond');

var average = function(values) {
    var sum = values.reduce(function(a, b) {
        return a+b;
    });
    return sum / values.length;
};

var calculate = function(data) {
    var roundTrip = data.returned - data.received,
        oneWay = roundTrip / 2,
        actuallyReceived = data.sent + oneWay;
    return data.received - actuallyReceived;
}

var complete = function(responses, deferred) {
    var avgRoundtrip = average(responses.map(function(r) {
            return r.returned - r.sent;
        })),
        avgPing = avgRoundtrip / 2,
        last = responses.last,
        timeReceived = last.sent + avgPing,
        timeDifference = timeReceived - last.received;
    deferred.resolve(timeDifference);
};

var timeshift = {
    measure: function(socket, options) {
        var i, deltaTs = [], count = 0,
            deferred = bond.deferred(),
            tsIO = socket.of('timeshift');
        options = options || {};
        options.pings = options.pings || 5;
        options.average = options.average || average;
        tsIO.on('measure', function(data) {
            var deltaT = calculate(data);
            deltaTs.push(deltaT);
            if ( count++ === pings ) {
                deferred.resolve(options.average(deltaTs));
            }
        });
        for ( i=0; i<pings; i++ ) {
            tsIO.emit('measure', {source:+new Date});
        }
        return deferred.promise();
    }
};