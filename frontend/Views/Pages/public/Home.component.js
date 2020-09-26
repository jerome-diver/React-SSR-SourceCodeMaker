import React, { useEffect, useState } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'

const Home = (props) => {
  const [home, setHome] = useState({ title: "", content: "" })
  const [load, setLoad] = useState(false)
  const { i18n } = useTranslation()

  useEffect( () => {
      const lang = i18n.language || 'en'
      console.log("--- home get language:", lang)
      fetch(`http://localhost:3000/api/home/${lang}`)
        .then(res => res.json())
        .then(respond => {
          setHome( { title: respond.title, content: respond.content } )
          setLoad(true) } )
  }, [i18n.language] )

  if (load) {
    return (
      <>
          <h1><FontAwesomeIcon icon={faCoffee} size="xs" color="blue" /> { home.title }</h1>
          <hr />
          <div id="home_article">{ parse(`${home.content}`) }</div>
      </>
    )
  } else {
    return (
      <>
          <Alert variant='info'>
              <Spinner animation='border' role='status'/>
              <p>Loading...</p>
          </Alert>
      </>
    )
  }
}

export default Home
