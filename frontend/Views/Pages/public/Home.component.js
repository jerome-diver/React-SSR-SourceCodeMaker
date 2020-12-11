import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import parse from 'html-react-parser'
import Loading from './Loading.component'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import { useTranslation } from 'react-i18next'

const useFetch = (url, trigger) => {
    const { i18n } = useTranslation()
    const [ loaded, setLoaded ] = useState(false)
    //const [ error, setError ] = useState({state: false, message: ""})
    const [ response, setResponse ] = useState({})

    useEffect( () => {
        console.log("FETCHING NOW lng is", i18n.language)
        fetch(url + "/" + i18n.language)
            .then(res => res.json())
            .then(respond => {
                setResponse(respond)
                setLoaded(true)
            } )
    }, [trigger] )
    
    return { loaded, response }
}

const Home = (props) => {
  const { getLanguage } = useAuthenticate()
  const { loaded, response } = useFetch('http://localhost:3000/api/home/', getLanguage)

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
  } else return <><Loading /></>
}

export default Home
