import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import parse from 'html-react-parser'
import { Loading, Error} from './Printers.component'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import { useTranslation } from "react-i18next"
import { TAG, HOST, SERVER_PORT } from '../../helpers/config'
//import { truncateSync } from 'fs'

const host = TAG + HOST + ":" + SERVER_PORT

const useFetch = (url, trigger) => {
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState({state: false, content: ""})
    const [ response, setResponse ] = useState({})

    useEffect( () => {
        console.log("FETCHING NOW Home to get translated content")
        if (url) {
          fetch(url)
              .then(res => res.json())
              .then(respond => setResponse({title: respond.title, content: parse(respond.content)}))
              .catch(err => setError({state: true, content: err}))
              .finally(() => setLoading(false))
        }
    }, [trigger] )
    
    return { loading, error, response }
}

const Home = (props) => {
  const { i18n, t } = useTranslation()
  const { getLanguage } = useAuthenticate()
  const url = host + '/api/home/' + i18n.language
  const { loading, error, response } = useFetch(url, getLanguage)

  if (loading) return <><Loading /></>
  else if(error.state) return <><Error title={t('error:home.title')} 
                                       name={error.content.name}
                                       message={error.content.message}/></>
  else {
    return (
      <>
          <h1><FontAwesomeIcon icon={faCoffee} size="xs" color="blue" /> { response.title }</h1>
          <hr />
          <div id="home_article">{ response.content }</div>
      </>
    )
  }
}

export default Home
