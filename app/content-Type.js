const setContentType = function(filePath) {
  let lastIndexOfDot = filePath.lastIndexOf(".");
  let contentType = filePath.substr(lastIndexOfDot);
  let type = {
    "/": "text/html",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".pdf": "text/pdf",
    ".ico": "image/ico"
  };
  return type[contentType];
};

exports.setContentType = setContentType;
