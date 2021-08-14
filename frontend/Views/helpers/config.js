import { i18n } from '../../../backend/i18n'
import { format } from 'date-fns'
import { fr as localeFR, en as localeEN } from 'date-fns/locale'

const accountEnabled = (valid) => (valid) 
                                ? {color: 'success', status: i18n.t('account.user.activated'), enabled: true}
                                : {color: 'danger', status: i18n.t('account.user.disabled'), enabled: false}
const TAG = 'http://'
const HOST = 'localhost'
const SERVER_PORT = 3000

const date_formed = (created) => {
    const format_date = `iiii, dd MMMM yyyy ${i18n.t('mailer:date.at')} HH:mm`
    let localization
    switch(i18n.language) {
        case 'fr':
            localization = localeFR
            break
        case 'en':
            localization = localeEN
            break
        default:
            localization = localeEN
    }
    return format(created, format_date, {locale: localization})
}

const colorType = (name) => {
  switch (name) {
    case "category":
      return 'rgb(155, 56, 90)'
      break
    case "subject":
      return 'rgb(150, 100, 50)'
      break
    case "article":
      return 'rgb(25, 56, 190)'
      break
    default:
      return 'rgb(80, 80, 80)'
  }
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
    default:
      return {title: container.title_en, content: container.content_en}
  }
}

export { TAG, HOST, SERVER_PORT, date_formed, accountEnabled, colorType, trContainer }
