import Crypto from 'crypto'
import Swal from 'sweetalert2'
import { validateAccount, modifyEmail, resetPassword } from '../../Controllers/user/authenticate-api'
import { i18n } from '../../../backend/i18n'

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
    var message = `<h6>${i18n.t('sanitizer.backend.request')}</h6>`
    const check_char = checkPassword(password)
    if (!check_char.countEnough) { passwordValidated = false; message += `<p>${i18n.t('sanitizer.backend.password.minimum')}</p>`; }
    if (!check_char.special) { passwordValidated = false;  message += `<p>${i18n.t('sanitizer.backend.password.special')}</p>` }
    if (!check_char.upperCase) { passwordValidated = false; message += `<p>${i18n.t('sanitizer.backend.password.upper_case')}</p>` }
    if (!check_char.lowerCase) { passwordValidated = false; message += `<p>${i18n.t('sanitizer.backend.password.lower_case')}</p>`  }
    if (!check_char.aNumber) { passwordValidated = false; message += `<p>${i18n.t('sanitizer.backend.password.number')}</p>` }
    const error = (!passwordValidated) ? {name: i18n.t('sanitizer.backend.password.title'), message: message} : false
    return [ error, passwordValidated ]
}

const validateEmail = (email) => {

}

const sendEmailLink = (what, user_data, emailSuccess, emailFailed) => {    
    let htmlText = null
    let action = null
    switch (what) {
        case 'newAccount':
            action = validateAccount
            htmlText = i18n.t('popup.signup.validate')
            break
        case 'updateEmail':
            action = modifyEmail
            htmlText = i18n.t('popup.email.modify') 
            break
        case 'updatePassword':
            action = resetPassword
            htmlText = i18n.t('popup.password.modify') 
            break
    }
    const validation = (data, to_do) => {
        to_do(data)
            .then(response => { 
                if(response.sent) emailHasBeenSent(emailSuccess, emailFailed)
                else fireError('Failed to send email', response.error) } )
            .catch(error => fireError(error.name, error.message))
    }
    Swal.fire({ title: 'Singup process success', html:  htmlText, icon:  'warning', 
                showCancelButton: true, cancelButtonText: "go Home",
                confirmButtonText: "Send email with link to validate" } )
        .then(result => (result.value) ? validation(user_data, action) : emailFailed() ) 
}

const emailHasBeenSent = (success, failed, htmlText) => {
    Swal.fire({ title: 'Email as been sent', html: htmlText, icon: 'success',
                showCancelButton: true, cancelButtonText: "go Home",
                confirmButtonText: 'Sign in'} )
        .then(result => (result.value) ? success() : failed() )
}

const canChangeEmail = (unlock, lock) => {
    Swal.fire({ title: i18n.t('popup.email.change.title'), 
                html: i18n.t('popup.email.change.text'),
                icon: 'warning',
                showCancelButton: true, 
                cancelButtonText: i18n.t('popup.email.change.button.cancel'),
                confirmButtonText: i18n.t('popup.email.change.button.ok')} )
        .then(result => (result.value) ? unlock() : lock() )
}

const fireError = (title, text) => Swal.fire(title, text, 'error')

export { cypher, checkPassword, validatePassword, validateEmail, 
         sendEmailLink, fireError, emailHasBeenSent, canChangeEmail }
