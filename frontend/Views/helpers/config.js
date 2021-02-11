import { i18n } from '../../../backend/i18n'

const accountEnabled = (valid) => (valid) 
                                ? {color: 'success', status: i18n.t('profile.account_enable')}
                                : {color: 'danger', status: i18n.t('profile.account_disable')}
const TAG = 'http://'
const HOST = 'localhost'
const SERVER_PORT = 3000

const cardColorType = (name) => {
  let color
  switch (name) {
    case "category":
      color = 'rgb(155, 56, 90)'
      break
    case "subject":
      color = 'rgb(150, 100, 50)'
      break
    case "article":
      color = 'rgb(25, 56, 190)'
      break
    default:
      color = 'rgb(80, 80, 80)'
  }
  return color
}


export { TAG, HOST, SERVER_PORT, accountEnabled, cardColorType }
