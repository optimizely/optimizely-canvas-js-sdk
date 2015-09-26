var expect = require('expect.js'),
    canvasSdk = require('../index');

describe('#extractUserContext', function() {

  var CLIENT_SECRET = 'a_client_secret',
      CONTEXT_OBJECT = {user: 'j@me.com'},
      // PLAINTEXT_CONTEXT = '{"user": "j@me.com"}',
      PLAINTEXT_CONTEXT_B64 = 'eyJ1c2VyIjogImpAbWUuY29tIn0=',
      // HASHED_CONTEXT = 'ba0633f2b30cdf262df73ac5f11fbf4c27525ae28016a32e9f73164587df3cb3',
      HASHED_CONTEXT_B64 = 'YmEwNjMzZjJiMzBjZGYyNjJkZjczYWM1ZjExZmJmNGMyNzUyNWFlMjgwMTZhMzJlOWY3MzE2NDU4N2RmM2NiMw==',
      FULL_SIGNED_REQUEST = 'YmEwNjMzZjJiMzBjZGYyNjJkZjczYWM1ZjExZmJmNGMyNzUyNWFlMjgwMTZhMzJlOWY3MzE2NDU4N2Rm'
          + 'M2NiMw==.eyJ1c2VyIjogImpAbWUuY29tIn0=';

  it('returns the decoded context when the context is properly signed', function() {
    expect(canvasSdk.extractUserContext(CLIENT_SECRET, FULL_SIGNED_REQUEST)).to.eql(CONTEXT_OBJECT);
  });

  it('throws an exception when the payload is not properly signed', function() {
    expect(canvasSdk.extractUserContext).withArgs(CLIENT_SECRET, 'invalidddddd.eyJ1c2VyIjogImpAbWUuY29tIn0')
        .to.throwException(/Request not properly signed./);
  });

});
