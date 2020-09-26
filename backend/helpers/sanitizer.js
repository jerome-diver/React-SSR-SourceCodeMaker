import { check } from 'express-validator'
import { i18n } from '../i18n'

const checkNewUser = [
    check('username')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.username_missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.username_empty')),
    check('email')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.email_missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.email_empty'))
      .isEmail()
      .withMessage(i18n.t('sanitizer.backend.email_valid')),
    check('password')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.password_missing'))
      .isLength({ min: 8 })
      .withMessage(i18n.t('sanitizer.backend.password_minimum'))
      .matches(/\d/)
      .withMessage(i18n.t('sanitizer.backend.password_number'))
      .matches(/[\/\\\.\@\!\:\;\,\+\-\*\}\]\)]/)
      .withMessage(i18n.t('sanitizer.backend.password_special'))
]
  
  /**
   * Validates update item request
   */
 const checkUpdateUser = [
    check('username')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.username_missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.username_empty')),
    check('email')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.email_missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.email_empty')),
    check('id')
      .exists()
      .withMessage(i18n.t('sanitizer.backend.id_missing'))
      .not()
      .isEmpty()
      .withMessage(i18n.t('sanitizer.backend.id_empty')),
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
