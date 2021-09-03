/* Validation tests for entries (input) from 
   Containers form data to pass 
   (and used by @hookform/resolver in Components */

import vest, { test, enforce, only } from 'vest'
import {i18n, options} from '../../backend/i18n'

const tests = vest.create((data = {}, fieldname) => {
  only(fieldname) // only the received filed to test (on "blur" time)

  /* "title" input field */
  test('title', i18n.t('error:containers.title.required'), () => {
    enforce(data.title).isNotEmpty()
  })

  test('title', i18n.t('error:containers.title.startByAlphabetHiCap'), () => {
    enforce(data.title).matches(/^[A-Z]/)
  })

  test('title', i18n.t('error:containers.title.noSpaceEnd'), () => {
    enforce(data.title).notMatches(/.*\s$/)
  })

  test('title', i18n.t('error:containers.title.shorterThan', {length: '64'}), () => {
    enforce(data.title).shorterThan(64)
  })

  test('title', i18n.t('error:containers.title.longerThan', {length: '3'}), () => {
    enforce(data.title).longerThan(3)
  })

  /* "photo" input filed for image file to upload */
  test('photo', i18n.t('error:containers.photo.isRequired'), () => {
    enforce(data.photo.file[0]).isNotEmpty()
  })

})

export { tests }