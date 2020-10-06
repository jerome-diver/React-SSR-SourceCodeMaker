import { check, validationResult } from 'express-validator'
import { i18n } from '../i18n'

const sanitizer = (req, res, next) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty) {
        let message = ''
        validationErrors.errors.forEach(error => { 
                  message += `${error.param}: ${error.msg}\n` })
        return res.status(403)
                  .json({ error: {
                            name: req.i18n.t('error:router.users.parser.name'), 
                            message: message } } )
    }
    next()
}

const checkPassword = [
    check('password')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.password.missing'))
      .isLength({ min: 8 })
      .withMessage(i18n.t('sanitizer.backend.password.minimum'))
      .matches(/\d/)
      .withMessage(i18n.t('sanitizer.backend.password.number'))
      .matches(/[\/\\\.\@\!\:\;\,\+\-\*\}\]\)]/)
      .withMessage(i18n.t('sanitizer.backend.password.special'))
]

const checkNewUser = [
    check('username')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.username.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.username.empty')),
    check('email')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.email.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.email.empty'))
      .isEmail()
      .withMessage(i18n.t('sanitizer.backend.email.valid')),
      ...checkPassword
]
  
  /**
   * Validates update item request
   */
 const checkUpdateUser = [
    check('username')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.username.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.username.empty')),
    check('email')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.email.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.email.empty'))
      .isEmail()
      .withMessage(i18n.t('sanitizer.backend.email.valid')),
    check('id')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.id.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.id.empty')),
]
  
  /**
   * Validates get item request
   */
const checkGetItem = [
    check('id')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
]
  
  /**
   * Validates delete item request
   */
const checkDeleteItem = [
    check('id')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
]

export { checkNewUser, checkUpdateUser, 
         checkGetItem, checkDeleteItem,
         checkPassword,
         sanitizer }
