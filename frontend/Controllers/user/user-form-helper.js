const CryptoJS = require('crypto-js')
import Swal from 'sweetalert2'
import { validateAccount, modifyEmail, resetPassword } from '../../Controllers/user/authenticate-api'
import { i18n } from '../../../backend/i18n'

const cypher = (password) => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex)
}

 const checkPassword = (password) => {
    return {
        minimum: (password.length >= 8),
        special: (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) != null),
        upper_case: (password.match(/(?=.*[A-Z])/) != null),
        lower_case: (password.match(/(?=.*[a-z])/) != null),
        number: (password.match(/(?=.*[0-9])/) != null)
    }
}

const validatePassword = (password) => {
    let message = `<h6>${i18n.t('sanitizer.backend.request')}</h6>`
    const check_char = checkPassword(password)
    for (const [key, value] of Object.entries(check_char)) {
        if (!value) message += `<p>${i18n.t('sanitizer.backend.password.' + key)}</p>` }
    let passwordValidated = false
    passwordValidated = Object.values(check_char).reduce(value => passwordValidated || value ) 
    const error = (passwordValidated) 
        ? false
        : {name: i18n.t('sanitizer.backend.password.title'), message: message} 
    return [ error, passwordValidated ]
}

const sendEmailLink = (target, user_data) => {    
    let succeed = null
    let failed = null
    let action = null
    switch (target) {
        case 'newAccount':
            action = validateAccount
            htmlText = i18n.t('popup.signup.validate')
            break
        case 'updateEmail':
            action = modifyEmail
            succeed = {
                title: i18n.t('popup.email.change.succeed.title'),
                content: i18n.t('popup.email.change.succeed.content'),
                link_ok: i18n.t('popup.email.change.succeed.link.ok'),
                icon: 'success'
            }
            failed = {
                title: i18n.t('popup.email.change.failed.title'),
                content: i18n.t('popup.email.change.failed.content'),
                link_ok: i18n.t('popup.email.change.failed.link.ok'),
                icon: 'danger'
            }
            break
        case 'updatePassword':
            action = resetPassword
            htmlText = i18n.t('popup.password.modify') 
            break
    }
    action(user_data)
        .then(response => {
            (response.sent) ? afterAction(succeed) : afterAction(failed)
            return (response.sent)
        })
}

const afterAction = (data) => {
    Swal.fire({ title: data.title, html: data.content, icon: data.icon,
                showCancelButton: false, confirmButtonText: data.link_ok} )
}

const fireError = (title, text) => Swal.fire(title, text, 'error')

export { cypher, checkPassword, validatePassword, 
         sendEmailLink, fireError }
