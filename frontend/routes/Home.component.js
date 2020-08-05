import React, { useEffect, useState } from 'react'

const Home = (props) => {
  const [home, setHome] = useState({
    title: "",
    content: ""
  })

  useEffect(
    () => {
        fetch('http://localhost:3000/api/home')
          .then(res => res.json())
          .then(respond => { setHome( 
              { title: respond.title,
                content: respond.content }
          ) } )
    }
  )


  return (
    <>
        <h1>{home.title}</h1>
        <hr />
        <div id="home_article">
          <p>{ home.content }</p>
        </div>
    </>
  )
}

export default Home;
