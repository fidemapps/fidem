# fidem

[ ![Codeship Status for sguimont/fidem](https://www.codeship.io/projects/d8c66c60-3786-0132-7181-4e7a21b2ccbb/status)](https://www.codeship.io/projects/41733)

Fidem node module provides an easy access to Fidem API.

## Install

```
npm install fidem
```

## Usage

````js
var fidem = require('fidem');

// Create a client.
var client = fidem.createClient({
  key: '1foakd92klda034kdkqsl',
  secret: '1kkdq45kQdd3LQDazep'
});

// Log action.
client.logAction({
  type: 'viewShow',
  data: {
    id: 'show1',
    name: 'The Big Show'
  }
}).then(function (result) {
  // ...
})

// Authenticate a user.
client.authenticate({
  username: 'johnny',
  password: 'mySecretPassword'
})
// Retrieve a user by token.
.then(function (result) {
  return client.getUserByToken(result.token);
})
.then(function (user) {
  // ...
});
````

### fidem.createClient(config)

Create a new API client.

```
* @param {object} config
* @param {string} config.key API key.
* @param {string} config.secret API secret.
* @param {string} [config.hostname="services.fidemapps.com"] Hostname.
* @param {string} [config.protocol=http] Protocol (http or https).
* @param {string} [config.port=80|443] Port.
* @returns {Client}
```

```js
var client = fidem.createClient({
  key: '1foakd92klda034kdkqsl',
  secret: '1kkdq45kQdd3LQDazep'
});
```

### client.authenticate(credentials, [cb])

Get an authentication token for the credentials provided.

```
* @param {object} credentials
* @param {string} credentials.username Username.
* @param {string} credentials.password Password.
* @param {Function} [cb] Optional callback.
* @returns {Promise}
```

```js
client.authenticate(credentials).then(function (res) {
  console.log(res.token); // xxx
  console.log(res.user); // {..}
});
```

### client.request(options, [cb])

Make a custom request to the API.

```
* @param {object} options Will use a session token request.
* @param {string} options.path Path of the request.
* @param {string} [options.token=null] Session token. If provided,
* @param {boolean} [options.sign=true] Sign the request using key and secret of the client.
* @param {string} [options.method=GET] HTTP method.
* @param {object} [options.body=null] HTTP body of the request for methods that supports it (POST, PUT, ...).
* @param {object} [options.headers={}] Additional headers.
* @param {object} [options.requestOptions={}] Custom options of the internal [request](https://github.com/mikeal/request#requestoptions-callback).
* @param {Function} [cb] Optional callback.
* @returns {Promise}
```

```js
client.request({
  path: '/gamification/actions',
  method: 'POST',
  data: {
    type: 'viewShow',
    data: {
      id: 'show1',
      name: 'The Big Show'
    }
  }
});
```

### client.getUserByToken(token, [cb])

Retrieve a user by token.

```
* @param {string} token Token of the user.
* @param {Function} [cb] Optional callback.
* @returns {Promise}
```

```js
client.getUserByToken('Qpaldj9kd');
```

### client.getUserByBearerToken(token, [cb])

Retrieve a user by bearer access token.

```
* @param {string} bearerToken Bearer Token of the user.
* @param {Function} [cb] Optional callback.
* @returns {Promise}
```

```js
client.getUserByBearerToken('eyJraWQiOiIzSldXV0k3OTJHQkZDSVlRVERLTEcyUTdFIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiIzM0Q4UWtBR3dJTWoxb1R5OTB0cTFtIiwiaWF0IjoxNDUyOTkxODY2LCJpc3MiOiJodHRwczovL2FwaS5zdG9ybXBhdGguY29tL3YxL2FwcGxpY2F0aW9ucy8xOGppdHVodlpRQ29UNzNkdXo0bnEwIiwic3ViIjoiaHR0cHM6Ly9hcGkuc3Rvcm1wYXRoLmNvbS92MS9hY2NvdW50cy80MXdacmk0b01ZcWRvU0dKbUxEVDlOIiwiZXhwIjoxNDUyOTk1NDY2LCJydGkiOiIzM0Q0NmdzNWFOdFczSTNwbTM2MEpDIn0.-p6ceniNoUZueLrIssgXA3D1a8ydZuUB-Jq1BjsluQM');
```

### client.logAction(action, [cb])

Log an action.

```
* @param {string} action Action.
* @param {Function} [cb] Optional callback.
* @returns {Promise}
```

```js
client.logAction({
  type: 'viewShow',
  data: {
    id: 'show1',
    name: 'The Big Show'
  }
});
```

### client.createMember(accountId, [cb])

Create a member.

```
* @param {Member} The member profile to create
* @param {Function} [cb] Optional callback.
* @returns {Promise}
```

```js
client.createMember({profile: {firstname: 'demo'}});
```

## License

MIT
