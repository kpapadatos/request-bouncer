'use strict';

class Bouncer {
    
    constructor(){
        
        this.requestPatterns = [];
        this.requestIndex = {};
        this.blacklistIndex = {};
        this._onUnknown = true;
        
        // Factory callback set to default setTimeout. Override for testability.
        // @todo Keep this in mind: http://stackoverflow.com/questions/12168708/is-there-any-limit-to-settimeout
        this.setTimeout = setTimeout;
        
    }
    
    // Used to add patterns
    bounce(requestPattern){
        
        requestPattern = new RequestPattern(requestPattern);

        this.requestPatterns.push(requestPattern);

        return requestPattern;
        
    }


    // Used to check requests
    check(requestObject){

        var requestID = this.getIdFromRequestObject(requestObject);
        var requestPattern = this.getPatternFromRequestObject(requestObject);

        // If unrecognized request, take the default action
        if (!requestID) return this._onUnknown;

        var blacklistIndex = this.blacklistIndex;

        // If requestID is banned, cut it
        if (requestID in blacklistIndex) return false;
        
        var requestIndex = this.requestIndex;
        
        // Make or load this request's record
        var record = requestIndex[requestID] || (requestIndex[requestID] = 0 );

        // If status is >= 1, add to blacklist
        if (record >= requestPattern._on) {

            blacklistIndex[requestID] = 1;

            // Clear from blacklist after pattern's for
            this.setTimeout(function () {
                delete blacklistIndex[requestID];
            }, requestPattern._for);

            return false;

        }

        // Update pool
        ++requestIndex[requestID];

        // Clear this request from pool after time specified by pattern
        this.setTimeout(function () {
            if(--requestIndex[requestID] == 0) delete requestIndex[requestID];
        }, requestPattern._over);

        // If we got here, pass
        return true;

    }
    
    // Used to make an ID out of a request and its pattern
    getIdFromRequestObject(requestObject){

        var patternWrapper = this.getPatternFromRequestObject(requestObject);

        if (!patternWrapper) return null;
        
        var requestID = [];

        var pattern = patternWrapper.pattern;

        for(let key in pattern.$match)
            requestID.push(key, pattern.$match[key]);
            
        for(let key of pattern.$include)
            requestID.push(key, requestObject[key]);

        return requestID.join('');

    }
    
    // Used to find the pattern of a request
    getPatternFromRequestObject(requestObject){

        var result = null;
        
        for(let requestPatternObject of this.requestPatterns) {
            
            var foundAll = true;
            
            for(let key in requestPatternObject.pattern.$match)
                if(requestPatternObject.pattern.$match[key] != requestObject[key])
                    { foundAll = false; break; }
        
            if(foundAll) {
                result = requestPatternObject;
                break;
            }
            
        }
            
        return result;

    }

    // Request indexes and pattern storage
    resetMonitorStatus(){
        this.requestIndex = {};
        this.blacklistIndex = {};
    }
    
    reset(){
        this.resetMonitorStatus();
        this.requestPatterns = [];
        this._onUnknown = true;
    }
    
    onUnknown(val) { 
        this._onUnknown = val; 
    }
    
}

// Wrap the pattern with this model to avoid conflicting with
// the on, over and for keys
class RequestPattern {
    
    constructor(pattern){
        
        // Default values
        this._on = 100;
        this._over = 10000;
        this._for = 10000;

        this.on = (val) => { this._on = val; return this; }
        this.over = (val) => { this._over = val; return this; }
        this.for = (val) => { this._for = val; return this; }

        this.pattern = pattern;
        
    }
    
}

module.exports = Bouncer;
