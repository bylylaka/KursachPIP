module.exports = {

    'facebookAuth' : {
        'clientID'      : '2026781947583394', // your App ID
        'clientSecret'  : '1a0391eb8ee5ae91c3e0fee078f91cfb', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'twitterAuth' : {
        'consumerKey'       : 'jm4JFX0ozaspYJxExqih4aH1t',
        'consumerSecret'    : '9RfzDp1DEkpKmdamTjH3xBpzhlPzzjkrpY2umL4zyVfIpS48nv',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '514820418525-5iio0rtbc9qr0bbo177ughcv1lhb4mv8.apps.googleusercontent.com',
        'clientSecret'  : 'q3Lhbdv6mp3E288yEdMxORWM',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
