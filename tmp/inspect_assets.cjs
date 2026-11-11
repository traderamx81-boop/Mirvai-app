const fs = require('fs');
const html = fs.readFileSync('/tmp/preview_site.html', 'utf-8');
const css = fs.readFileSync('/tmp/review.css', 'utf-8');
const js = fs.readFileSync('/tmp/review.js', 'utf-8');

const combined = html + '\n' + css + '\n' + js;

const urls = [...combined.matchAll(/https?:\/\/[^\s"'()]+/g)].map(m => m[0]);
console.log('Unique external URLs:', [...new Set(urls)]);

const imgs = [...combined.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Image src attributes:', [...new Set(imgs)]);

const cssUrls = [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m => m[1]);
console.log('CSS url() matches:', [...new Set(cssUrls)]);
