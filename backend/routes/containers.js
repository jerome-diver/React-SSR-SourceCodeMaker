import { hasAuthorization } from './middlewares/authentication';
import { checkContainer, sanitizer } from './middlewares/sanitizer'
import { uploadImage } from './middlewares/upload'
import Container from '../models/container.model'
import Type from '../models/type.model'
const express = require('express');
const router = express.Router();

/* POST to create a new container for :type name */
router.post('/', [hasAuthorization, checkContainer, sanitizer], (req, res) => {
  const { title, content, image_link,  parent_id, type_id, enable, author_id } = req.body
  if ((req.token.role_title === 'Writer') || (req.token.role_title === 'Admin')) {
    const container = new Container({title, content, image_link, parent_id, type_id, enable, author_id: req.token.id })
    container.save().catch(error => {
        let message = ''
        if (error.errors) {
          error.errors.forEach(err => message += `${err.title}: ${err.message}\n`)
        } else message = error.code
        return res.status(401).json( 
          { error: {
              title: req.i18n.t('error:database.containers.create.failed.validation'), 
              message } }) })
      return res.status(201).json( { created: true, content: container.toJSON() } )
  }
} )

/* GET containers list for :type_name 
  (can be any [subject, category, ...] 
   or what ever type you created) */
router.get('/type_id/:type_name', (req, res) => {
  Container.find({type_name: req.params.type_name}).exec()
    .then(containers => {return containers.map((container) => { return {id: container._id, enabled: container.enable}})})
    .then(response => {return res.status(200).json(response)})
    .catch(error => { return res.status(401).json({ error }) })
} )

/* GET containers list for :type_name 
  (can be any [subject, category, ...] 
   or what ever type you created) */
router.get('/type/:type_name', (req, res) => {
  Container.find({type_name: req.params.type_name}).exec()
    .then(containers => {return containers.map((container) => { return container.toJSON()})})
    .then(response => {return res.status(200).json(response)})
    .catch(error => { return res.status(401).json({ error }) })
} )

/* GET containers child id list of container :id 
  (can be any child: [subject, articles, comments, ...] 
   or what ever type you created)
   _should return something like:
    {
      [ id, ... ]
    }
*/
router.get('/children_ids_of/:id', (req, res) => {
  console.log("I searching for child IDs of container ID:", req.params.id)
  Container.find({ parent_id: req.params.id }).exec()
    .then(containers => {
      console.log("I found any...")
      return containers.map((container) => { return {id: container._id, enabled: container.enable } }) })
    .then(data => { return res.status(200).json(data) })
    .catch(error => { return res.status(401).json({ error }) })
})

/* GET containers child list for container :id 
  (can be any child: [subject, articles, comments, ...] 
   or what ever type you created)
   _should return something like:
    {
      head: {container: <Container>, type: <Type>},
      children: [ {container: <Container>, type: <Type>}, ... ]
    }
*/
router.get('/children_of/:id', (req, res) => {
  Container.findOne({ _id: req.params.id }).exec()
    .then(container => { return { head: { container: container.toJSON() } } })
    .then(founded => {
      const type = Type.findOne({ name: founded.head.container.type_name }).exec()
      const containers = Container.find({ parent_id: founded.head.container.id }).exec()
      Promise.all([type, containers])
        .then( (resolve) => {
          founded.head.type = resolve[0].toJSON()
          founded.containers = resolve[1].map((container) => { return container.toJSON() })
          return res.status(200).json(founded) })
        .catch(error => { return res.status(401).json({ error }) })
      })
    .catch(error => { return res.status(401).json({ error }) })
})

/* GET a container from his id */
router.get('/:id', (req, res) => {
  Container.findOne({ _id: req.params.id }).exec()
    .then(container => { return res.status(200).json({find: true, content: container.toJSON()}) })
    .catch( error => { return res.status(401).json({ error }) })
} )

/* POST to update an existing container from his id */
router.post('/:id/update', [hasAuthorization, checkContainer, sanitizer, uploadImage], (req, res) => {
  console.log("UPDATE body:", req.body)
  if (((req.token.role_name == 'Writer') && (req.token.id == req.body.author_id)) || (req.token.role_name == 'Admin')) {
      console.log("UPDATE possible by this user")
      const toUpdate = (req.file) ? {...req.body, image_link: req.file.filename} : req.body
      Container.findOneAndUpdate( { _id: req.params.id }, toUpdate, { new: true }).exec()
        .then(container => { return res.status(201).json({updated: true, content: container.toJSON()}) })
        .catch(error => { return res.status(400).json( 
              { error: 
                { title: req.i18n.t('error:database.containers.update.failed'), 
                  message: error } }) })
  }
} )

/* DELETE to remove an existing container from his name */
router.delete('/:id', [hasAuthorization], (req, res) => {
  if (req.token.role_name == 'Admin') {
    Container.deleteOne( { _id: req.params.id }).exec()
      .then(response => { 
        if (response.acknowledged == false) throw req.i18n.t('error:database.containers.delete.unacknowledged')
        else return res.status(200).json({deleted: true}) })
      .catch(error => { return res.status(401).json( 
        { error: {
            title: req.i18n.t('error:database.containers.delete.failed'),
            message: error } } ) })
  }
} )

module.exports = router;
