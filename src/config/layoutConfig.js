var config = {
   partials: {
       register: '../partials/register-partial.ejs',
       mainPage: '../partials/main.ejs',
       polls: '../partials/polls-partial.ejs',
       login: '../partials/login-partial.ejs',
       profile: '../partials/profile-partial.ejs',
       settings: '../partials/settings-partial.ejs',
       singlePoll: '../partials/single-poll-partial.ejs'
   },
   pageSettings: { 
       main: {
           title: 'Welcome to my homepage!',
           h2: 'Custom polls with live results'
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
           title: 'Hi, User!',
           h2: 'Start Creating Polls and Share Them'
       },
       settings: {
           title: 'Hi, User!',
           h2: 'Change your password or your account name'
       },
       singlePoll:{
           title: 'Vote now',
           h2: 'Vote now and pick how you want to see the data'
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
                   href: '/auth/profile/settings',
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