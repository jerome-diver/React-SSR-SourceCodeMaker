var express = require('express')
var router = express.Router()


/* GET home page. */
router.get('/:lang', function(req, res, next) {

  //const lng = req.params.lang || 'en'
  const language = req.i18n.language
  const i18n = req.i18n
  i18n.changeLanguage(language)
  //const language = req.i18n.language  // see i18nextMiddleware (failed to change)
  console.log("From api/home GET request on server, i get language:", i18n.language)
  //i18n.reloadResources(['en', 'fr'])
//  i18n.changeLanguage(lng)
  //  .then((t) => {
    
      const home_title = req.t('home.title')
      const home_content = req.t('home.content')
      res.json( { 
        title: home_title, content: home_content })
//    })

})

module.exports = router
