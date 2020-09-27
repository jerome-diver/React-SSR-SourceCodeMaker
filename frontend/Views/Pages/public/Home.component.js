import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { useTranslation, useSSR } from 'react-i18next'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import parse from 'html-react-parser'
import Loading from './Loading.component'

const Home = (props) => {
  const { language } = props
  const [home, setHome] = useState({ title: "", content: "" })
  const [load, setLoad] = useState(false)

  useEffect( () => {
      console.log("--- Home component, useEffect, get language:", language)
      fetch('http://localhost:3000/api/home/')
        .then(res => res.json())
        .then(respond => {
          setHome( { title: respond.title, content: respond.content } )
          setLoad(true) } )
  }, [language] )

  if (load) {
    return (
      <>
          <h1><FontAwesomeIcon icon={faCoffee} size="xs" color="blue" /> { home.title }</h1>
          <hr />
          <div id="home_article">{ parse(`${home.content}`) }</div>
      </>
    )
  } else return <><Loading /></>
}

export default Home
