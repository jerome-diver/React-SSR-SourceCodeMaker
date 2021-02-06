const express = require('express');
const router = express.Router();
import { hasAuthorization } from '../controllers/authentication';
import { checkType, sanitizer } from '../helpers/sanitizer'
import Type from '../models/type.model'

/* GET types list */
router.get('/', (req, res) => {
  Type.find({}, (error, types) => {
    if (error) return res.status(401).json({ error })
    res.status(200).json(types.map((type) => { return type.toJSON()}))
  })
} )

/* POST to create a new type */
router.post('/', [hasAuthorization], (req, res) => {
  const {user_id, name, description} = req.body
  if ((req.token.id == user_id) || (req.token.role_name == 'Admin')) {
    const type = new Type( { name, description } )
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

/* PUT to update an existing type from his id */
router.put('/:id', [hasAuthorization, checkType, sanitizer], (req, res) => {
  const {user_id, name, description, enable} = req.body
  if ((req.token.id == user_id) || 
      (req.token.role_name == 'Writer') || 
      (req.token.role_name == 'Admin')) {
    Type.findOneAndUpdate( { _id: req.params.id }, 
        { name, description, enable, parent_id, type_id } , 
        { new: true },
        (error, type) => {
            if (error) return res.status(400).json( { error: 
                    { name: req.i18n.t('error:database.types.update.failed'), 
                      message: error } } )
            return res.status(200).json({ accepted: true })
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
