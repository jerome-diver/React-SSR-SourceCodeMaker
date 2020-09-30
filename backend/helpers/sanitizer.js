import { check } from 'express-validator'
import { i18n } from '../i18n'

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
      .withMessage(i18n.t('sanitizer.backend.email.empty')),
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
         checkGetItem, checkDeleteItem }
