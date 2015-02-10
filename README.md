# Passport-azure-ad-oauth2

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
* `useCommonEndpoint`: [optional] use "https://login.windows.net/common" instead of default endpoint (https://login.windows.net/{tenant}). This is typically enabled if you're using this for a Multi-tenant application in Azure AD (Default: `false`).

```javascript
passport.use(new AzureAdOAuth2Strategy({
  clientID: '{YOUR_CLIENT_ID}',
  clientSecret: '{YOUR_CLIENT_SECRET}',
  callbackURL: 'https://www.example.net/auth/azureadoauth2/callback',
  resource: '00000002-0000-0000-c000-000000000000',
  tenant: 'contoso.onmicrosoft.com'
},
function (accessToken, refresh_token, params, profile, done) {
  var waadProfile = profile || jwt.decode(params.id_token, '', true);

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

## License

[The MIT License](http://opensource.org/licenses/MIT)
