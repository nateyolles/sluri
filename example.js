var SLURI = require("sluri");
var sluri = new SLURI('http://user:pass@www.nateyolles.com/us/en/page.foo.bar.html/biz/baz?a=alpha&b=bravo#charlie');

console.log(sluri.hostname);

console.log(sluri.resourcePath);
console.log(sluri.extension);

console.log(sluri.selectorString);
console.log(sluri.selectors.has('foo'));
sluri.selectors.append('biz');
sluri.selectors.delete('bar');
console.log(sluri.selectorString);

console.log(sluri.searchParams.get('a'));
sluri.searchParams.append('d', 'delta');
console.log(sluri.search);