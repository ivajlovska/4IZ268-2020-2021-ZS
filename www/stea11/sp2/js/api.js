const KEY = "C1VeneK0c7iRPfhPrnqTbGJG6P1aVDlS";

function getTrending(callback) {
  return $.getJSON(`http://api.giphy.com/v1/gifs/trending?api_key=${KEY}`).done(
    (resp) => {
      callback(resp.data);
    }
  );
}

function getTrendingOffset(offset, callback) {
  return $.getJSON(
    `http://api.giphy.com/v1/gifs/trending?api_key=${KEY}&offset=${offset}`
  ).done((resp) => {
    callback(resp.data);
  });
}

function getSearch(search, callback) {
  return $.getJSON(
    `http://api.giphy.com/v1/gifs/search?api_key=${KEY}&q=${search}`
  ).done((resp) => {
    callback(resp.data);
  });
}

function getAutoComplete(search, callback) {
  return $.getJSON(
    `http://api.giphy.com/v1/gifs/search/tags?api_key=${KEY}&q=${search}`
  ).done((resp) => {
    callback(resp.data);
  });
}
