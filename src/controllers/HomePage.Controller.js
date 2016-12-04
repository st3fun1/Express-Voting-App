var config = require('../config/layoutConfig');
exports.index = function(req,res){
        
        res.render('index', {
            viewData: {
            partial: config.partials.mainPage, 
            title: config.pageSettings.main.title,
            h2: config.pageSettings.main.h2,
            }
        });
};