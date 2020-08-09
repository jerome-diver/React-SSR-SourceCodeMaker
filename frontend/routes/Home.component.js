import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const Home = (props) => {
  const [home, setHome] = useState({ title: "", content: "" })
  const [load, setLoad] = useState(false)

  useEffect( () => {
      console.log("UseEffect of Home component call")
      fetch('http://localhost:3000/api/home')
        .then(res => res.json())
        .then(respond => {
          setHome( { title: respond.title, content: respond.content } )
          setLoad(true) } )
  }, [] )

  if (load) {
    return (
      <>
          <h1><FontAwesomeIcon icon={faCoffee} size="xs" color="blue" /> {home.title}</h1>
          <hr />
          <div id="home_article">
            <p>{ home.content }</p>
          </div>
      </>
    )
  } else {
    return (
      <Spinner animation='border' role='status'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    )
  }
}

export default Home;
