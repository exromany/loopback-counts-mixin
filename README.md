# loopback-counts-mixin
A mixin to enable get count of related models for a loopback Model.

## INSTALL

```
npm install --save loopback-counts-mixin
```

There are 2 ways to enable mixin:

### 1) server.js

In your server/server.js file add the following line before the boot(app, __dirname); line.

```js
...
var app = module.exports = loopback();
...
// Add Counts Mixin to loopback
require('loopback-counts-mixin')(app);

boot(app, __dirname, function(err) {
  'use strict';
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
```

### 2) mixin sources

Add the mixins property to your server/model-config.json like the following:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "loopback/server/mixins",
      "../node_modules/loopback-counts-mixin",
      "../common/mixins",
      "./mixins"
    ]
  }
}
```

## CONFIG

To use with your Models add the `mixins` attribute to the definition object of your model config.

```json
{
  "name": "game",
  "properties": {
    "title": "string"
  },
  "relations": {
    "players": {
      "type": "hasMany",
      "model": "player"
    }
  },
  "mixins": {
    "Counts": true
  }
}
```

## USAGE

In fetching data with `counts` filter, will added field named like `relationnameCount`

## EXAMPLE

```
http://0.0.0.0:3000/api/games?filter={"counts":"players"}
```

will return list of games with field `playersCount`

```json
[
  {
    "id": 1,
    "title": "First game",
    "playersCount": 1
  },
  {
    "id": 2,
    "title": "Last game",
    "playersCount": 42
  }
]
```

## LICENSE

MIT

