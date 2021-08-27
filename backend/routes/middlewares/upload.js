/* Middlkeware used to upload files with multer library help */

const format = require("date-fns/format")

const util = require("util")
const multer = require("multer")
const maxSize = 2 * 1024 * 1024

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./build/public/uploads/");
  },
  filename: (req, file, cb) => {
    const [name, ext] = file.originalname.split('.')
    const fileName = name + " - " + format(Date.now(), "yyy-MM-dd_hhmmss") + "." + ext
    console.log("Defin e uploaded file name:", fileName);
    cb(null, fileName);
  },
})

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("image")

const uploadImage = util.promisify(uploadFile)

export { uploadImage }
