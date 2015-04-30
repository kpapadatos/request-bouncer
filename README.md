# http-bouncer 

[![Build Status](https://travis-ci.org/raelgor/http-bouncer.svg?branch=master)](https://travis-ci.org/raelgor/http-bouncer)

A small IP and JSON API request oriented HTTP security system for express apps.

### Install

```
npm install http-bouncer
```

### Example

```js
var express = require('express'),
    app = express(),
    bouncer = require('http-bouncer')

app.use('*',bouncer);

// Next route...
```
