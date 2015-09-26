var crypto = require('crypto');

var CANVAS_HMAC_ALGORITHM = 'sha256';

// TODO(jon): Look further into re-using code from the JWT community (see http://jwt.io).

module.exports = {

  /**
   * Validate and decode the user context served to an app using the Optimizely Canvas.
   *
   * @param {String} clientSecret the OAuth client secret provided by Optimizely to the app developer. The secret is
   *                              specific to the app.
   * @param  {String} signedRequest the value of the signed request provided by Optimizely to the app (that is, the
   *                                value of the "signed_request" parameter provided by Optimizely).
   * @return {Object} containing the user context provided by Optimizely, including user email, current project, etc.
   * @throws {Error} if the provided signedRequest is malformed or does not appear to be authentic since it was not
   *                 correctly signed with the provided client secret.
   */
  extractUserContext: function(clientSecret, signedRequest) {
    var signedRequestParts = signedRequest.split('.');

    var hashedContext = signedRequestParts[0],
        unhashedContext = signedRequestParts[1];

    var rehashedContext =
        new Buffer(crypto.createHmac(CANVAS_HMAC_ALGORITHM, clientSecret).update(unhashedContext).digest('hex'))
        .toString('base64');

    if (rehashedContext !== hashedContext) {
      throw Error('Request not properly signed.')
    }

    return JSON.parse(new Buffer(unhashedContext, 'base64'));
  },
};
