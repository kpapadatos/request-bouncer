var bounce = require('./bouncer.js');

console.log(bounce);

bounce({ $match: { hi: '5' } }).on(2).over(10000).for(10000);

console.log(bounce.check({ hi:'5' }));
console.log(bounce.check({ hi:'5' }));
console.log(bounce.check({ hi:'5' }));