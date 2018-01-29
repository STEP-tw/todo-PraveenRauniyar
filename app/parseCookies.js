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

const parseCookies = text => {
  try {
    return text && text.split(';').map(toKeyValue).reduce(accumulate, {}) || {};
  } catch (e) {
    return {};
  };
};

const getCookies = (req,res,next)=>{
  req.cookies = parseCookies(req.headers.cookie || '');
  next();
}

exports.getCookies = getCookies;
