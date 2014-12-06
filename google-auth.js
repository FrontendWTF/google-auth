angular.module('google.auth', [
  'google.platform'
]).provider('GoogleAuth', function (
) {
  var provider = {
    params: {},
    $get: function (
      $q,
      $rootScope,
      GooglePlatform
    ) {
      var signIn = $q.defer();

      function signInByGoogle (params) {
        GooglePlatform.promise.then(function (google) {
          google.auth.signIn(angular.extend({
            callback: googleSignInCallback
          }, provider.params, params));

          return google;
        });

        return signIn.promise;
      }

      function googleSignInCallback (response) {
        if (response.status.signed_in) {
          $rootScope.$broadcast('google.auth:signInSuccess', response);
          signIn.resolve(response);
        } else if (response.error.user_signed_out) {
          $rootScope.$broadcast('google.auth:signOutSuccess', response);
        } else {
          $rootScope.$broadcast('google.auth:signInError', response);
          signIn.reject(response);
        }
      }

      return {
        signIn: signInByGoogle,
        signOut: function () {
          GooglePlatform.promise.then(function (google) {
            google.auth.signOut();

            return google;
          });
        }
      };
    }
  };

  return provider;
});
