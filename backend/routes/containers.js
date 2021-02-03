const express = require('express');
const router = express.Router();
import { hasAuthorization } from '../controllers/authentication';
import { checkContainer, sanitizer } from '../helpers/sanitizer'
import Container from '../models/container.model'
import Type from '../models/type.model'

const get_type_from_name = (name) => {
  Type.findOne({name: name}, (error, type) => {
    if (error) return { error }
    return { error: false, ...type.toJSON() }
  })
}
/* GET containers list for :type 
  (can be any [subject, category, ...] 
   or what ever type you created) */
router.get('/:type', (req, res) => {
  let type = get_type_from_name(req.params.type)
  if (type.error) return res.status(401).json({ error: type.error })
  Container.find({type_id: type.id}, (error, containers) => {
    if (error) return res.status(401).json({ error })
    res.status(200).json(containers.map((container) => { return container.toJSON()}))
  })
});

/* POST to create a new container for :type */
router.post('/:type', [hasAuthorization, checkContainer, sanitizer], (req, res) => {
  let type = get_type_from_name(req.params.type)
  if (type.error) return res.status(401).json({ error: type.error })
  const container = new Container( {
    name: req.body.name,
    description: req.body.description,
    type_id: type.id,
    parent_id: req.body.parent_id } )
  container.save((error) => {
    if (error) {
      let message = ''
      if (error.errors) {
        error.errors.forEach(err => message += `${err.name}: ${err.message}\n`)
      } else return res.status(401).json({error: { name: error.name, message: error.code } } )
      return res.status(401).json( { error: {
                     name: req.i18n.t('error:database.users.create.failed.validation'), 
                     message: message } } ) }
    return res.status(200).json( { accepted: true } )
} ) } )

/* PUT to update an existing container from his name */
router.put('/:id', [hasAuthorization, checkContainer, sanitizer], (req, res) => {
  const {user_id, name, description, parent_id, type_id, enable} = req.body
  if ((req.token.id == user_id) || 
      (req.token.role_name == 'Writer') || 
      (req.token.role_name == 'Admin')) {
    Container.findOneAndUpdate( { _id: req.params.id }, 
        { name: name, description: description, enable: enable, 
          parent_id: parent_id, type_id: type_id } , 
        { new: true },
        (error, container) => {
            if (error) return res.status(400).json( { error: 
                    { name: req.i18n.t('error:database.containers.update.failed'), 
                      message: error } } )
            return res.status(200).json({ accepted: true })
        } )
  }
})

/* DELETE to remove an existing container from his name */
router.delete('/:id', [hasAuthorization], (req, res) => {
  if (req.token.role_name == 'Admin') {
    Container.deleteOne( { _id: req.params.id }, (error, response) => {
      if (error || response.acknowledged == false) return res.status(401).json( { error: {
            name: req.i18n.t('error:database.container.delete.failed'),
            message: error } } )
      return res.status(200).json( { accepted: true } )
      })
    }
})

module.exports = router;
