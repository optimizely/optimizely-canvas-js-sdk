# optimizely-canvas-js-sdk [![Build Status](https://magnum.travis-ci.com/optimizely/optimizely-canvas-js-sdk.svg?token=YFDwv84aYxfE7DHxqDdT&branch=master)](https://magnum.travis-ci.com/optimizely/optimizely-canvas-js-sdk)

An SDK providing JavaScript utilities for developing on the Optimizely Canvas.

## Installation

To install this package in your node environment, run:

```bash
npm install "git+ssh://github.com/optimizely/optimizely-canvas-js-sdk.git"
```

##Usage

*Note*: This example request is properly signed (albeit with a weak demo secret), so feel free to try actually parsing
it with this package.

Say you host your Canvas app at https://michelangelo.appspot.com/canvas. If Optimizely serves a Canvas request like this:

```
https://michelangelo.appspot.com/canvas?signed_request=ZDhiNWFkMTA0ZjFjZjFhMDU0NWQzZjE5MTI1YWZlNTk0YjQzYTU5Y2NiMjgxZjY2NTgxYmM3YzYyYjgxNzAwMg%3D%3D.eyJjb250ZXh0Ijp7ImVudmlyb25tZW50Ijp7ImN1cnJlbnRfcHJvamVjdCI6MTIzNDU2NywiY3VycmVudF9hY2NvdW50Ijo3NjU0MzIxfSwiY2xpZW50Ijp7ImFjY2Vzc190b2tlbiI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejEyMyIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJleHBpcmVzX2luIjo3MjAwfSwidXNlciI6eyJlbWFpbCI6ImpvbkBvcHRpbWl6ZWx5LmNvbSJ9fX0%3D
```

You simply extract the URL-decoded value of the `signed_request` parameter, grab your Canvas app's OAuth client secret
from [this page](https://app.optimizely.com/accountsettings/apps/developers), and invoke the SDK package's
`extractUserContext` function with client secret and the signed request value:

```js
var canvasSdk = require('optimizely-canvas-sdk');

var signedRequest = 'ZDhiNWFkMTA0ZjFjZjFhMDU0NWQzZjE5MTI1YWZlNTk0YjQzYTU5Y2NiMjgxZjY2NTgxYmM3YzYyYjgxNzAwMg==.eyJjb250ZXh0Ijp7ImVudmlyb25tZW50Ijp7ImN1cnJlbnRfcHJvamVjdCI6MTIzNDU2NywiY3VycmVudF9hY2NvdW50Ijo3NjU0MzIxfSwiY2xpZW50Ijp7ImFjY2Vzc190b2tlbiI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejEyMyIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJleHBpcmVzX2luIjo3MjAwfSwidXNlciI6eyJlbWFpbCI6ImpvbkBvcHRpbWl6ZWx5LmNvbSJ9fX0=';

var userContext = canvasSdk.extractUserContext('my_oauth_client_secret', signedRequest);
```

`userContext` will then be a JavaScript object like this:

```js
{ context:
   { environment: { current_project: 1234567, current_account: 7654321 },
     client:
      { access_token: '1234567890abcdefghijklmnopqrstuvwxyz123',
        token_type: 'bearer',
        expires_in: 7200 },
     user: { email: 'jon@optimizely.com' }
   }
}
```

##Error Handling

In the event the request is not properly signed, an error will be thrown:

```js
> var userContext = canvasSdk.extractUserContext('my_oauth_client_secret', 'nope' + signedRequest);
Error: Request not properly signed.
    at Error (native)
```

If an error is thrown, you should immediately return an HTTP 401 to the user and assume the request was malicious. Do
not do any processing for the user or expose any data to the user.
