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
  console.log(result.status); // 200
})

// Authenticate a user.
client.authenticate({
  username: 'johnny',
  password: 'mySecretPassword'
})
// Retrieve a user by token.
.then(function (token) {
  return client.getUserByToken(token);
})
.then(function (user) {
  // ...
});
````

### fidem.createClient(options)

Create a new API client.

- key: API key, required.
- secret: API secret, required.
- hostname: API hostname. Optional, defaults to "services.fidemapps.com".
- port: API port. Optional, defaults to 80.

```js
var client = fidem.createClient({
  key: '1foakd92klda034kdkqsl',
  secret: '1kkdq45kQdd3LQDazep'
});
```

### client.authenticate(credentials, [cb])

Get an authentication token for the credentials provided.

```js
client.authenticate(credentials)
.then(function (token) {
  // ...
}, function (error) {
  // ...
});
```

### client.request(options, [cb])

Make a custom request to the API.

Options:

- token: Session token, if provided, will use a session token request. Optional, if not defined will sign the request using key and secret.
- method: HTTP method, optional, defaults to GET.
- path: HTTP path of the request.
- body: HTTP body of the request for methods that supports it (POST, PUT, ...).

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
})
.then(function (result) {
  // ...
}, function (err) {
  // ...
});
```

## License

MIT
