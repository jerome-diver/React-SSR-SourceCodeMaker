import { i18n } from '../../../backend/i18n'

const accountEnabled = (valid) => (valid) 
                                ? {color: 'success', status: i18n.t('profile.account_enable')}
                                : {color: 'danger', status: i18n.t('profile.account_disable')}


export { accountEnabled }
