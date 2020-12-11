import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import parse from 'html-react-parser'
import { Loading, Error} from './Printers.component'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import { useTranslation } from "react-i18next"
import { truncateSync } from 'fs'

const useFetch = (url, trigger) => {
    const [ loaded, setLoaded ] = useState(false)
    const [ error, setError ] = useState({state: false, message: ""})
    const [ response, setResponse ] = useState({})

    useEffect( () => {
        console.log("FETCHING NOW lng")
        fetch(url)
            .then(res => res.json())
            .then(respond => {
                setResponse(respond)
                setLoaded(true)
            .catch((err) => { setError({state: true, content: err}) })
            } )
    }, [trigger] )
    
    return { loaded, error, response }
}

const Home = (props) => {
  const { t } = useTranslation()
  const { getLanguage } = useAuthenticate()
  const url = 'http://localhost:3000/api/home/' + getLanguage()
  const { loaded, error, response } = useFetch(url, getLanguage)

  useEffect(() => {
      console.log("This is the responses:", response)
  }, [])

  if (loaded) {
    return (
      <>
          <h1><FontAwesomeIcon icon={faCoffee} size="xs" color="blue" /> { response.title }</h1>
          <hr />
          <div id="home_article">{ parse(response.content) }</div>
      </>
    )
  } else if(error.state) return <><Error title={t('error:home.title')} 
                                         name={error.content.name}
                                         message={error.content.message}/></>
  else return <><Loading /></>
}

export default Home
