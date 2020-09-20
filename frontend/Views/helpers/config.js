import i18n from '../../../backend/i18n'

const accountEnabled = (valid) => (valid) 
                                ? {color: 'success', status: i18n.t('profile.account_enable')}
                                : {color: 'danger', status: i18n.t('profile.account_disable')}

const html_new_user = "<div class='alert alert-info'><p>A new user has been created, but need a validation to be ready to use.</p>"

export { accountEnabled, unlock_email_text, html_new_user }
