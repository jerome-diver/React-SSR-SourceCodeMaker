/* it is all about a MongoDB Container linked with a Type 
   Containers component there is the main Component to use
   to adapt return back for each situation depending on route and options
*/

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Loading, Error} from './Printers.component'
import { useAuthenticate } from '../../../Controllers/context/authenticate'
import { useTranslation } from "react-i18next"
import parse from 'html-react-parser'
import { useParams } from 'react-router-dom'
import { TAG, HOST, SERVER_PORT, cardColorType } from '../../helpers/config'
import { Card, CardGroup } from 'react-bootstrap'

const host = TAG + HOST + ":" + SERVER_PORT

/* fetching data to get database collection entries back */
const useFetch = (url, trigger) => {
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState({state: false, content: ""})
    const [ containers, setContainers ] = useState({})

    useEffect(() => {
        console.log("FETCHING NOW to get container(s) data for language: ", trigger)
        if (url) {
          fetch(url)
            .then( response => response.json() )
            .then( response => setContainers( response ) )
            .catch( err => setError( { state: true, content: err } ) )
            .finally( () => setLoading( false ) )
        }
    }, [trigger] )
    
    return { loading, error, containers }
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
  }
}

/* Print the content of a container on top */
const HeadContent = ({ data }) => (
    <>
    </>
)

/* Print cards with partial content and a link */
const CardSimple = (props) => {
  const { data, lng, link, text } = props
  const color = cardColorType("category")
  return (
    <>
      <style type="text/css">
        {`
        .category {
          margin: 5px;
          min-width: 300px;
          max-width: 450px;
          border: 1px solid ${color};
        }
        .card-body {
          background-color: rgba(55, 44, 44, 0.85); }
        `}
      </style>
      <Card className="category">
        <Card.Img variant="top" src={`/uploads/${data.image_link}`} />
        <Card.Body>
          <Card.Title>{trContainer(lng, data).title}</Card.Title>
          <Card.Text>{trContainer(lng, data).content}</Card.Text>
          <Card.Link href={link}>{text}</Card.Link>
        </Card.Body>
      </Card>
    </>
  )
}

const CardList = (CardSimple) => (
    <>
    </>
)

const CardTree = ({ data, link, text }) => (
    <>
    </>
)

/* type is a string for type name for containers list to print for,
   children is an Object with two keys: {other, same} with boolean values
   to show children for same and other types.
   head is a boolean value for show params :id container content on head first. */
const Containers = (props) => {
  const { type, children, head, } = props
  const { id, title } = useParams()
  console.log("Inside Containers component for ", type)
  const { i18n, t } = useTranslation()
  const language = i18n.language
 // const { getLanguage } = useAuthenticate()
  const url = (type) ? host + '/api/containers/' + type
                     : host + '/api/containers/child_of/' + id
  const { loading, error, containers } = useFetch(url, language)

  if (loading) return <><Loading /></>
  else if(error.state) return <><Error title={t('error:home.title')} 
                                       name={error.content.name}
                                       message={error.content.message}/></>
  else {
    if (type != undefined) { // print categories list only (cards)
      return (
        <>
          <h1>{t('containers.list', {type: type})}</h1>
          <hr/>
          <CardGroup>
            { containers.map( (container, index) => { 
              if (container.enable) {
                return ( <CardSimple data={container} 
                                     lng={language}
                                     key={index} 
                                     link={`/${type}/${container.id}/${trContainer(language, container).title}`}
                                     text={t('containers.link', { type: type,
                                                                  title: trContainer(language, container).title})} />) 
              }
            } ) }
          </CardGroup>
        </>
      )
    } else if (head == true) {

    }
  }
}

/* Props Types checking part... */

Containers.propTypes = {
  type: PropTypes.string,
  children: PropTypes.exact({
              same: PropTypes.bool,
              other: PropTypes.bool }),
  head: PropTypes.bool
}

export default Containers
