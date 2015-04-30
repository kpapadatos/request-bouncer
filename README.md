# http-bouncer 

[![Build Status](https://travis-ci.org/raelgor/http-bouncer.svg?branch=master)](https://travis-ci.org/raelgor/http-bouncer)

A small IP and JSON API request based HTTP security system for express apps.

### Install

```
npm install http-bouncer
```

### Example

```js
var express = require('express'),
    app = express(),
    bouncer = require('http-bouncer'),
    bodyParser = require('body-parser');

// You need this to use the bouncer for JSON API calls
app.use(bodyParser.json({}));

// Configure the bouncer
bouncer.config = {

    // These values mean that 40 requests will be answered
    // per IP address every 10 secs
    GLOBAL_IP_CHECK_INTERVAL: 10000,
    GLOBAL_IP_PER_INTERVAL: 40,
    
    JSON_API_CALLS: [
        {
            MATCH: {
                    api: "core",
                    request: "login"
            },
            INTERVAL: 10000,
            LIMIT: 10,
            INCLUDE_IP: true,
            INCLUDE_FROM_MATCH: ["username"]
        }
        
        // More matches...
    
    ]

};

app.use('*',bouncer);

// Next route...
```

The JSON_API_CALLS match declared above translates to the following limitation:
Only 10 requests every 10 seconds will be answered by each IP address. Said requests are in JSON format and contain
```json
{ "api": "core", "request": "login", "username":"example" }
```
So the user `example` can only try to login 10 times every 10 seconds from the same IP address.

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

