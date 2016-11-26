var config = {
   partials: {
       register: '../partials/register-partial.ejs',
       mainPage: '../partials/main.ejs',
       polls: '../partials/polls-partial.ejs',
       login: '../partials/login-partial.ejs',
       profile: '../partials/profile-partial.ejs',
       changePassword: '../partials/changePassword.ejs',
       singlePoll: '../partials/single-poll-partial.ejs',
       accountSettings: '../partials/account-settings.ejs',
       pollsSettings:'../partials/polls-settings.ejs'
   },
   pageSettings: { 
       main: {
           title: 'Votist',
           h2: 'Custom polls with live results',
       },
       register: {
           title: 'Register',
           h2: 'Register for creating polls'
       },
       polls: {
           title: 'Polls',
           h2: 'List of all polls'
       },
       login: {
           title: 'Login',
           h2: 'Login to create poll'
       },
       profile: {
           title: 'Profile',
           h2: 'Start Creating Polls and Share Them'
       },
       accountSettings: {
           title: 'Manage account',
           h2: 'Change your password or your account name'
       },
       pollsSettings: {
           title: 'Manage polls',
           h2: 'Delete or edit polls'
       },
       singlePoll:{
           title: 'Vote now',
           h2: 'Vote now and pick how you want to see the data',
           scripts:[{path:'https://www.gstatic.com/charts/loader.js'},
                             {path: '/scripts/charts.js'}]
       },
       nav: {
           loggedOut:{links:[
               {
                   href: '/polls',
                   name: 'Polls'
               },
               {
                   href: '/auth/register',
                   name: 'Register'
               },
               {
                   href: '/auth/login',
                   name: 'Login'
               }]
           },
           loggedIn:{links:[
               {
                   href: '/polls',
                   name: 'Polls'
               },
               {
                   href: '/auth/profile',
                   name: 'Profile'
               },
               {
                   href: '/settings',
                   name: 'Settings'
               },
               {
                   href: '/auth/logout',
                   name: 'Logout'
               }]
           }
       }
   }
};

module.exports = config;