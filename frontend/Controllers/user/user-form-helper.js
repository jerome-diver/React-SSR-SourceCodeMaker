import Crypto from 'crypto'
import validator from 'validator'
import { check, validationResult } from 'express-validator'

const cypher = (password) => {
    return Crypto.createHash('sha256').update(password).digest('hex')
}

 const checkPassword = (password) => {
    var checkChar = {
        countEnough: (password.length >= 8),
        special: password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/),
        upperCase: password.match(/(?=.*[A-Z])/),
        lowerCase: password.match(/(?=.*[a-z])/),
        aNumber: password.match(/(?=.*[0-9])/),
    }
    return checkChar
}

const validatePassword = (password) => {
    var passwordValidated = true
    var message = "<h6>need:</h6>"
    const check_char = checkPassword(password)
    if (!check_char.countEnough) { passwordValidated = false; message += '<p>more chars (8 minimum)</p>'; }
    if (!check_char.special) { passwordValidated = false;  message += '<p>a special char inside</p>' }
    if (!check_char.upperCase) { passwordValidated = false; message += '<p>a upper case char inside</p>' }
    if (!check_char.lowerCase) { passwordValidated = false; message += '<p>a lower case char inside</p>'  }
    if (!check_char.aNumber) { passwordValidated = false; message += '<p>a numeric char inside</p>' }
    return [ message, passwordValidated ]
}

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
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY')
      .isLength({ min: 8 })
      .withMessage('PASSWORD_TOO_SHORT_MIN_8'),
    (req, res, next) => {
      validationResult(req, res, next)
    }
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
    (req, res, next) => {
      validationResult(req, res, next)
    }
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
    (req, res, next) => {
      validationResult(req, res, next)
    }
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
    (req, res, next) => {
      validationResult(req, res, next)
    }
]

export {cypher, checkPassword, validatePassword, checkNewUser, checkUpdateUser, 
        checkGetItem, checkDeleteItem}
