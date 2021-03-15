const express = require('express');
const router = express.Router();
import { hasAuthorization } from './middlewares/authentication';
import { checkType, sanitizer } from './middlewares/sanitizer'
import Type from '../models/type.model'

/* POST to create a new type */
router.post('/', [hasAuthorization], (req, res) => {
  const {user_id, name, description, rules, enable} = req.body
  if ((req.token.id == user_id) || (req.token.role_name == 'Admin')) {
    const type = new Type( { name, description, rules, enable } )
    type.save((error) => {
        if (error) {
        let message = ''
        if (error.errors) {
            error.errors.forEach(err => message += `${err.name}: ${err.message}\n`)
        } else return res.status(401).json({error: { name: error.name, message: error.code } } )
        return res.status(401).json( { error: {
                        name: req.i18n.t('error:database.users.create.failed.validation'), 
                        message: message } } ) }
        return res.status(200).json( { accepted: true } )
  } ) } 
} )

/* GET types list */
router.get('/', (req, res) => {
  Type.find({}, (error, types) => {
    if (error) return res.status(401).json({ error })
    res.status(200).json(types.map((type) => { return type.toJSON()}))
  })
} )

/* GET a type from his id */
router.get('/', (req, res) => {
  const id = req.body.id
  Type.findOne({ _id: id }, (error, type) => {
    if (error) return res.status(401).json({ error })
    return res.status(200).json( { content: type.toJSON()})
  })
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
router.delete('/:id', [hasAuthorization], (req, res) => {
  if (req.token.role_name == 'Admin') {
    Type.deleteOne( { _id: req.params.id }, (error, response) => {
      if (error || response.acknowledged == false) return res.status(401).json( { error: {
            name: req.i18n.t('error:database.type.delete.failed'),
            message: error } } )
      return res.status(200).json( { accepted: true } )
      } )
    }
} )

module.exports = router;
