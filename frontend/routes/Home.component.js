import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const Home = (props) => {
  const [home, setHome] = useState({
    title: "",
    content: "" 
  })

  useEffect( () => {
      console.log("UseEffect of Home component call")
      fetch('http://localhost:3000/api/home')
        .then(res => res.json())
        .then(respond => setHome( 
            { title: respond.title,
              content: respond.content } ) )
  }, [] )

  return (
    <>
        <h1><FontAwesomeIcon icon={faCoffee} size="xs" color="blue" /> {home.title}</h1>
        <hr />
        <div id="home_article">
          <p>{ home.content }</p>
        </div>
    </>
  )
}

export default Home;
