const queryString = require('querystring');
const toKeyValue = kv => {
  let parts = kv.split('=');
  return {
    key: parts[0].trim(),
    value: parts[1].trim()
  };
};

const accumulate = (o, kv) => {
  o[kv.key] = kv.value;
  return o;
};

let redirect = function(path) {
  console.log(`redirecting to ${path}`);
  this.statusCode = 302;
  this.setHeader('location', path);
  this.end();
};

const parseCookies = text => {
  try {
    return text && text.split(';').map(toKeyValue).reduce(accumulate, {}) || {};
  } catch (e) {
    return {};
  };
};

let invoke = function(req, res) {
  let handler = this._handlers[req.method][req.url];
  if (handler)
    handler(req, res);
};

const initialize = function() {
  this._handlers = {
    GET: {},
    POST: {}
  };
  this._preprocess = [];
  this._postprocess = [];
};

const get = function(url, handler) {
  this._handlers.GET[url] = handler;
}

const post = function(url, handler) {
  this._handlers.POST[url] = handler;
};

const use = function(handler) {
  this._preprocess.push(handler);
};

const postUse = function(handler) {
  this._postprocess.push(handler);
}

const urlIsOneOf = function(urls) {
  return urls.includes(this.url);
};

const parseCookiesAndBindRes = function(req, res) {
  res.redirect = redirect.bind(res);
  req.urlIsOneOf = urlIsOneOf.bind(req);
  req.cookies = parseCookies(req.headers.cookie || '');
};

const runProcess = function(processors, req, res) {
  processors.forEach(middleware => {
    if (res.finished) return;
    middleware(req, res);
  });
};


const main = function(req, res) {
  console.log(req.url,req.method);
  parseCookiesAndBindRes(req, res);
  let content = "";
  req.on('data', data => content += data.toString());
  req.on('end', () => {
    req.body = queryString.parse(content);
    runProcess(this._preprocess, req, res)
    if (res.finished) return;
    invoke.call(this, req, res);
    if (res.finished) return;
    runProcess(this._postprocess, req, res);
  });
};

let create = () => {
  let rh = (req, res) => {
    main.call(rh, req, res);
  };
  initialize.call(rh);
  rh.get = get;
  rh.post = post;
  rh.use = use;
  rh.postUse = postUse;
  return rh;
};
exports.create = create;
