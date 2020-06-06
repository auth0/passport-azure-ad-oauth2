# Passport-azure-ad-oauth2

This is a fork of
[auth0/passport-azure-ad-oauth2](https://github.com/auth0/passport-azure-ad-oauth2). It changed function authorizationParams to return a clone of the passed options object, rather than the original object. This resolves a fault cause by the caller (passport-oauth2) modifying the returned object which, in the original implementation, caused failure of subsequent authentication attempts.

[Passport](http://passportjs.org/) strategy for authenticating with [Azure AD](http://msdn.microsoft.com/en-us/library/azure/dn645545.aspx)
using the OAuth 2.0 protocol.

## Install

    $ npm install passport-azure-ad-oauth2

## Usage

#### Configure Strategy

The Azure AD OAuth 2.0 authentication strategy authenticates requests by delegating to Azure AD using the OAuth 2.0 protocol.

Applications must supply a `verify` callback which accepts an `accessToken`, `refresh_token`, `params` and service-specific `profile`, and then calls the `done` callback supplying a `user`, which should be set to `false` if the credentials are not valid.  If an exception occured, `err` should be set.

##### Options

* `clientID`: specifies the client id of the application that is registered in Azure Active Directory.
* `clientSecret`: secret used to establish ownership of the client Id.
* `callbackURL`: URL to which Azure AD will redirect the user after obtaining authorization.
* `resource`: [optional] the App ID URI of the web API (secured resource).
* `tenant`: [optional] tenant domain (e.g.: contoso.onmicrosoft.com).
* `useCommonEndpoint`: [optional] use "https://login.microsoftonline.com/common" instead of default endpoint (https://login.microsoftonline.com/{tenant}). This is typically enabled if you're using this for a Multi-tenant application in Azure AD (Default: `false`).

```javascript
passport.use(new AzureAdOAuth2Strategy({
  clientID: '{YOUR_CLIENT_ID}',
  clientSecret: '{YOUR_CLIENT_SECRET}',
  callbackURL: 'https://www.example.net/auth/azureadoauth2/callback',
  resource: '00000002-0000-0000-c000-000000000000',
  tenant: 'contoso.onmicrosoft.com'
},
function (accessToken, refresh_token, params, profile, done) {
  // currently we can't find a way to exchange access token by user info (see userProfile implementation), so
  // you will need a jwt-package like https://github.com/auth0/node-jsonwebtoken to decode id_token and get waad profile
  var waadProfile = profile || jwt.decode(params.id_token);

  // this is just an example: here you would provide a model *User* with the function *findOrCreate*
  User.findOrCreate({ id: waadProfile.upn }, function (err, user) {
    done(err, user);
  });
}));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'azure_ad_oauth2'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```javascript
app.get('/auth/azureadoauth2',
  passport.authenticate('azure_ad_oauth2'));

app.get('/auth/azureadoauth2/callback', 
  passport.authenticate('azure_ad_oauth2', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Tests

    $ npm install
    $ npm test
    
## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)
  - [Azure AD Team](https://github.com/AzureAD/azure-activedirectory-library-for-nodejs)

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
