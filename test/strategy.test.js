var expect                = require('chai').expect;
var AzureAdOAuth2Strategy = require('..');

describe('Strategy', function() {
    
  var strategy = new AzureAdOAuth2Strategy({
    clientID: 'abc123',
    clientSecret: 'shhh',
    callbackURL: 'https://www.example.net/auth/azureadoauth2/callback',
    resource: '00000002-0000-0000-c000-000000000000',
    tenant: 'contoso.onmicrosoft.com'
  },
  function () {});
  
  it('should be named azure_ad_oauth2', function () {
    expect(strategy.name).to.equal('azure_ad_oauth2');
  });
});
