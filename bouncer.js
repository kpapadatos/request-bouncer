// Bouncer
// Main HTTP IP-based security system

var bouncer = function (request, res, next) {

    var ip = request.connection.remoteAddress,
        apiCall = request.body;

    // Check if request ip is blacklisted
    if (bouncer.blacklist[ip]) return false;

    // Register request
    if (!bouncer.restrictions[ip]) bouncer.restrictions[ip] = 0;
    if (++bouncer.restrictions[ip] >= bouncer.config.GLOBAL_IP_PER_INTERVAL) {

        bouncer.blacklist[ip] = 1;

    } else {

        if(bouncer.blacklist[ip]) delete bouncer.blacklist[ip];

    }

    // Set timeout to clear restrictions
    setTimeout(function () {
        bouncer.restrictions[ip]--;
        if (bouncer.restrictions[ip] < bouncer.config.GLOBAL_IP_PER_INTERVAL && bouncer.blacklist[ip]) delete bouncer.blacklist[ip];
        if (!bouncer.restrictions[ip]) delete bouncer.restrictions[ip];
    }, bouncer.config.GLOBAL_IP_CHECK_INTERVAL);

    // Bounce JSON
    if (typeof apiCall != "object") try { apiCall = JSON.parse(apiCall); } catch (x) { }
    if (typeof apiCall == "object") {

        for (var i in bouncer.config.JSON_API_CALLS) {

            var call = bouncer.config.JSON_API_CALLS[i],
                restrictionAddress = call.INCLUDE_IP ? ip + ':' : '',
                match = call.MATCH,
                matchFlag = true;

            for (var p in match) {

                if (apiCall[p] != match[p]) matchFlag = false;
                else {

                    restrictionAddress += ':' + p + ':' + match[p];

                }

            }

            if (!matchFlag) continue;

            call.INCLUDE_FROM_MATCH = call.INCLUDE_FROM_MATCH || [];
            call.INCLUDE_FROM_MATCH.forEach(function (key) {
                restrictionAddress += ':' + key + ':' + apiCall[key];
            });

            if (bouncer.blacklist[restrictionAddress]) return false;

            if (!bouncer.restrictions[restrictionAddress]) bouncer.restrictions[restrictionAddress] = 0;
            if (++bouncer.restrictions[restrictionAddress] >= call.LIMIT) bouncer.blacklist[restrictionAddress] = 1;
            else {
                if (bouncer.blacklist[restrictionAddress]) delete bouncer.blacklist[restrictionAddress];
            }

            setTimeout(function () {
                bouncer.restrictions[restrictionAddress]--;
                if (bouncer.restrictions[restrictionAddress] < call.LIMIT && bouncer.blacklist[restrictionAddress]) delete bouncer.blacklist[restrictionAddress];
                if (!bouncer.restrictions[restrictionAddress]) delete bouncer.restrictions[restrictionAddress];
            }, call.INTERVAL);

        }

    }

    // Allow request to pass
    return next ? next() : true;

}

// Configuration
bouncer.config = {

    GLOBAL_IP_CHECK_INTERVAL: 10000,
    GLOBAL_IP_PER_INTERVAL: 40,

    JSON_API_CALLS: [
        
    ]

}

bouncer.blacklist = {};
bouncer.restrictions = {};

module.exports = bouncer;