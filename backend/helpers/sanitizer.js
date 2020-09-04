import { check, validationResult } from 'express-validator'
import validator from 'validator'

const checkNewUser = [
    check('username')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
    check('email')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY')
      .isEmail()
      .withMessage('EMAIL_IS_NOT_VALID'),
    check('password')
      .exists()
      .withMessage('MISSING')
      .isLength({ min: 8 })
      .withMessage('PASSWORD_TOO_SHORT_MIN_8')
      .matches(/\d/)
      .withMessage('Password should have number inside')
]
  
  /**
   * Validates update item request
   */
 const checkUpdateUser = [
    check('username')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
    check('email')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
    check('id')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
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
