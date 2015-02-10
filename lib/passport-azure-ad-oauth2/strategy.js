/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Azure AD OAuth 2.0 authentication strategy authenticates requests by delegating to
 * Azure AD using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refresh_token`, `params` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`           specifies the client id of the application that is registered in Azure Active Directory
 *   - `clientSecret`       secret used to establish ownership of the client Id
 *   - `callbackURL`        URL to which Azure AD will redirect the user after obtaining authorization
 *   - `resource`           [optional] the App ID URI of the web API (secured resource)
 *   - `tenant`             [optional] tenant domain (e.g.: contoso.onmicrosoft.com)
 *   - `useCommonEndpoint`  [optional] Use "https://login.windows.net/common" instead of default endpoint (https://login.windows.net/{your_domain})
 *
 * Examples:
 *
 *     passport.use(new AzureAdOAuth2Strategy({
 *         clientID: 'yourClientId',
 *         clientSecret: 'youAADIssuedClientSecret',
 *         callbackURL: 'https://www.example.net/auth/azureadoauth2/callback',
 *         resource: '00000002-0000-0000-c000-000000000000',
 *         tenant: 'contoso.onmicrosoft.com'
 *       },
 *       function (accessToken, refresh_token, params, profile, done) {
 *         var waadProfile = profile || jwt.decode(params.id_token, '', true);
 *         
 *         User.findOrCreate({ id: waadProfile.upn }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy (options, verify) {
  // more details: http://msdn.microsoft.com/en-us/library/azure/dn645542.aspx
  options = options || {};

  var base_url = 'https://login.windows.net/' + ((!options.useCommonEndpoint && options.tenant) || 'common');
  options.authorizationURL = options.authorizationURL || base_url + '/oauth2/authorize';
  options.tokenURL = options.tokenURL || base_url + '/oauth2/token';
  
  OAuth2Strategy.call(this, options, verify);

  this.name = 'azure_ad_oauth2';
  this.resource = options.resource;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Authenticate request by delegating to Azure AD using OAuth.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
  if (!options.resource && this.resource) { // include default resource as authorization parameter
    options.resource = this.resource;
  }
  
  // Call the base class for standard OAuth authentication.
  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

/**
 * Retrieve user profile from Azure AD.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `azure_ad_oauth2`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  // waad provides user profile information in the id_token response (params.id_token).
  done(null, { provider: 'azure_ad_oauth2' });
  
  /*this._oauth2.get('https://login.windows.net/{XYZ}/openid/userinfo', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
  });*/
};

/**
 * Return extra Azure AD-specific parameters to be included in the authorization
 * request.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function (options) {
  return options;
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
