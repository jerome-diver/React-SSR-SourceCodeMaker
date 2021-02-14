import Container from '../models/container.model'

const getImage = async (req, res) => {  
  Container.findOne({image_link: req.params.image_link})
    .then(result => res.status(200).json({success: true}))
    .catch(error => res.status(401).json({error}))
}

const uploadImage = async (req, res) => {
    if (req.file && req.file.path) {
      Container.findOneAndUpdate(
            {_id: req.body.id}, 
            {image_link: req.file.path} )
        .then(resolve => res.status(200).json( { success: true } ) )
        .catch(error => res.status(401).json({error}) )
    } else {
      console.log("no path for ", req.file)
      return res.status(422).json( { error: "invalid" } ) }
}

module.exports = { getImage,  uploadImage }
