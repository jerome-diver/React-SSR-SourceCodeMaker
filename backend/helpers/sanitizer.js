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
      .withMessage(i18n.t('sanitizer:backend.user.password.missing'))
      .isLength({ min: 8 })
      .withMessage(i18n.t('sanitizer:backend.user.password.minimum'))
      .matches(/\d/)
      .withMessage(i18n.t('sanitizer:backend.user.password.number'))
      .matches(/[\/\\\.\@\!\:\;\,\+\-\*\}\]\)]/)
      .withMessage(i18n.t('sanitizer:backend.user.password.special'))
]

const checkEmail = [
    check('email')
      .exists()
      .withMessage(i18n.t('sanitizer:backend.user.email.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer:backend.user.email.empty'))
      .isEmail()
      .withMessage(i18n.t('sanitizer:backend.user.email.valid')),
]

const checkNewUser = [
    check('username')
      .exists()
      .withMessage(i18n.t('sanitizer:backend.user.username.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer:backend.user.username.empty')),
      ...checkEmail,
      ...checkPassword
]
  
  /**
   * Validates update item request
   */
 const checkUpdateUser = [
    check('username')
      .exists()
      .withMessage(i18n.t('sanitizer:backend.user.username.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer:backend.user.username.empty')),
    check('email')
      .exists()
      .withMessage(i18n.t('sanitizer:backend.user.email.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer:backend.user.email.empty'))
      .isEmail()
      .withMessage(i18n.t('sanitizer:backend.user.email.valid')),
    check('id')
      .exists()
      .withMessage(i18n.t('sanitizer:backend.user.id.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer:backend.user.id.empty')),
]

  /**
   * Validate new and update container
   */
  const checkContainer = [
    check('title')
      .exists()
      .withMessage(i18n.t('sanitizer:backend.container.title.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer:backend.container.title.empty')),
    check('content')
      .exists()
      .withMessage(i18n.t('sanitizer:backend.container.content.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer:backend.container.content.empty'))
  ]

  /**
   * Validate new and update type
   */
  const checkType = [
    check('name')
      .exists()
      .withMessage(i18n.t('sanitizer:backend.type.name.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer:backend.type.name.empty')),
    check('description')
      .exists()
      .withMessage(i18n.t('sanitizer:backend.type.description.missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer:backend.type.description.empty'))
  ]
  

export { checkNewUser, checkUpdateUser, 
         checkPassword, checkEmail,
         checkContainer,
         checkType,
         sanitizer }
