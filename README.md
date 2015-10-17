# http-bouncer 

[![NPM version](http://img.shields.io/npm/v/http-bouncer.svg?style=flat-square)](https://www.npmjs.org/package/http-bouncer) [![NPM license](http://img.shields.io/npm/l/http-bouncer.svg?style=flat-square)](https://www.npmjs.org/package/http-bouncer)

A small IP and JSON API request based HTTP security system for express apps.

### Install

```
npm install http-bouncer
```

### Example

```js
var bounce = require('http-bouncer');

// Adds a new bouncing rule
bounce({
    // The rule applies if the #match
    // pattern matches
    $match: {
        request: 'login'
    },
    // These values of the request
    // will be added to its identifier
    $include: {
        username: 1,
        ip: 1
    }
})
// Blacklist these requests when we've had 100
// of them in 10 seconds for 10 seconds
.on(100).over(10000).for(10000);
```

In the example above, only 100 login requests will be allowed every 10 seconds before a 10 second ban occurs.
Now that we have added the rule, let's validate a request:
```js
// This returns true or false depending
// on the matching rules
bounce.check({
    request: 'login',
    username: 'someone',
    password: 'something',
    ip: '127.0.0.1'
});
```

## TODO
- Replace `setTimeout` logic with something friendlier to the system in case of DDoS.

## License



(The MIT License)



Copyright (c) 2015 Kosmas Papadatos &lt;kosmas.papadatos@gmail.com&gt;



Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:



The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.



THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

