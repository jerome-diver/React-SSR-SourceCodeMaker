import { i18n } from '../../../backend/i18n'

const accountEnabled = (valid) => (valid) 
                                ? {color: 'success', status: i18n.t('profile.account_enable')}
                                : {color: 'danger', status: i18n.t('profile.account_disable')}
const TAG = 'http://'
const HOST = 'localhost'
const SERVER_PORT = 3000

const colorType = (name) => {
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

/* Translate container title and content by choosing its entry */
const trContainer = (lng, container) => {
  switch (lng) {
    case 'fr':
      return {title: container.title, content: container.content}
    case 'en':
      return {title: container.title_en, content: container.content_en}
    case 'us':
      return {title: container.title_en, content: container.content_en}
  }
}

export { TAG, HOST, SERVER_PORT, accountEnabled, colorType, trContainer }
