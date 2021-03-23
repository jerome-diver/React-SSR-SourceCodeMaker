const express = require('express');
const router = express.Router();
import { hasAuthorization, isOwnerOrAdmin } from './middlewares/authentication';
import { checkType, sanitizer } from './middlewares/sanitizer'
import Type from '../models/type.model'

/* POST to create a new type */
router.post('/', [hasAuthorization, isOwnerOrAdmin], (req, res) => {
  const {user_id, name, description, rules, enable} = req.body
  const type = new Type( { name, description, rules, enable } )
  type.save().exec()
    .then(type => { return res.status(200).json({accepted: true}) })
    .catch(error => {
      let message = ''
      let name = ''
      if (error.errors) {
        name = req.i18n.t('error:database.users.create.failed.validation')
        error.errors.forEach(err => message += `${err.name}: ${err.message}\n`)
      } else {
        name = error.name
        message = error.code
      }
      return res.status(401).json({error: {name, message}})
  } )
} )

/* GET types list */
router.get('/', (req, res) => {
  Type.find({}).exec()
    .then(types => { return res.status(200).json(types.map((type) => {return type.toJSON()})) })
    .catch(error => { return res.status(401).json({ error }) })
})

/* GET a type from his id */
router.get('/', (req, res) => {
  const id = req.body.id
  Type.findOne({ _id: id }).exec()
    .then(type => { return res.status(200).json({content: type.toJSON()}) })
    .catch(error => { return res.sttus(401).json({ error }) })
} )

/* PUT to update an existing type from his id */
router.put('/:id', [hasAuthorization, checkType, sanitizer], (req, res) => {
  const {user_id, name, description, rules, enable} = req.body
  if ((req.token.id == user_id) || 
      (req.token.role_name == 'Writer') || 
      (req.token.role_name == 'Admin')) {
    Type.findOneAndUpdate( { _id: req.params.id }, 
        { name, description, rules, enable } , 
        { new: true },
        (error, type) => {
            if (error) return res.status(400).json( { error: 
                    { name: req.i18n.t('error:database.types.update.failed'), 
                      message: error } } )
            return res.status(200).json({ accepted: true, type: type.toJSON() })
  } ) }
} )

/* DELETE to remove an existing type from his id */
router.delete('/:id', [hasAuthorization, isOwnerOrAdmin], (req, res) => {
    Type.deleteOne( { _id: req.params.id }).exec()
      .then(response => {
        if (response.acknowledged == false) throw new Error(req.i18n.t('error:type.unknown'))
        return res.status(200).json({accepted: true}) })
      .catch(error => { return res.status(401).json({
        error: {
            name: req.i18n.t('error:database.type.delete.failed'),
            message: error}}) })
} )

module.exports = router;
