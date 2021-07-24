/* it is all about a MongoDB Container linked with a Type 
   Containers component there is the main Component to use
   to adapt return back for each situation depending on route and options
*/

import React, { useState, useEffect } from 'react'
import { string, bool, object, func, exact, shape, arrayOf } from 'prop-types'
import { Loading, Error } from './Printers.component'
import { useAuthenticate, itsMine, canModify } from '../../../Controllers/context/authenticate'
import { useTranslation } from "react-i18next"
import parse from 'html-react-parser'
import { useParams } from 'react-router-dom'
import { colorType, trContainer } from '../../helpers/config'
import { crud_caller, crud_list } from '../../../Controllers/container/action-CRUD'
import { Card, CardGroup, Jumbotron, Badge, Button, Form, InputGroup } from 'react-bootstrap'
import loadable from '@loadable/component'
const Editor = loadable(() => import('for-editor'))


/* fetching data to get database collection entries back */
const useFetch = (crud_name, data, trigger) => {
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState({state: false, content: ""})
    const [ containers, setContainers ] = useState({})
    useEffect(() => {
        console.log("==> useFetch for CRUD's container function name:", crud_name)
        if (crud_list.includes(crud_name)) {
          crud_caller['$' + crud_name](data, setContainers, setError, setLoading) 
        }
    }, [trigger] )
    return { loading, error, containers }
}

const deleteContent = (content, type) => { console.log("DELETE") }

const ActionLinks = ( { data, type, callback } ) => {
  const { getUser, getRole } = useAuthenticate()
  const { t } = useTranslation()
  const user = getUser()
  const role = getRole()
  const editContent = () => { callback('edit') }
  const cancel = () => { callback('normal') }
  if (canModify(role, type) || itsMine(user, data)) {
    return (
      <>
        <Button onClick={editContent} variant="warning">
          { t('containers.content.edit', { content: data.title }) }
        </Button>
        <Button onClick={() => deleteContent(content, type)} variant="danger">
          { t('containers.content.delete', { content: data.content }) }
        </Button>
        <Button onClick={cancel}>{ t('containers.content.cancel') }</Button>
      </>
    )
  } else return null
}

/* Print the content of a container on top */
const HeadContent = ( { container, type } ) => {
  const { i18n, t } = useTranslation()
  const [ mode, setMode ] = useState('normal')
  const [ validated, setValidated ] = useState(false)
  const [ form, setForm ] = useState({ title:   { fr: container.title,   
                                                  en: container.title_en }, 
                                       content: { fr: container.content, 
                                                  en: container.content_en } })
  const type_to_translate = "containers." + type.name
  const change = target => e => {
    if (target == 'title') setForm({...form, title: { [i18n.language]: e.target.value} })
    else setForm({...form, content: { [i18n.language]: e } })
  }
  const updateContainer = (e) => {
    const form_to_submit = e.currentTarget;
    if (form_to_submit.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    } else {
      console.log("UPDATE CONTAINER EVENT")
      const data = { id: container.id, body: {...container} }
      const { loading, error } = useFetch('updateContainer', data, i18n.language)
    }
    setValidated(true)
  }
/*   useEffect(() => {
  }, []) */
  switch (mode) {
    case 'normal':
      return ( <>
        <style type='text/css'>
          {` #head-container-title h1 { display: inline-block; }
            #head-container-text { font-family: 'Santana'; }
            .badge { 
              vertical-align: top; 
              font-family: 'Source Code Pro'; }
            #head-container {
              background-image: linear-gradient(to bottom left, rgb(99,99,99), rgb(44,32,22));
              background-color: rgba(99,99,99,0.75)
            }       `}
        </style>
        <Jumbotron id='head-container'>
          <div id='head-container-title'>
            {trContainer(i18n.language, container).title}&nbsp;
            <Badge variant='info'>{t(type_to_translate)}</Badge>
          </div>
          <div id="head-container-text">
            {parse(trContainer(i18n.language, container).content)}
          </div>
          <ActionLinks data={container} type={type} callback={setMode}/>
        </Jumbotron>
      </> )
      break
    case 'edit':
      return ( <>
        <Jumbotron id='edit-container'>
          <Badge variant='warning'>{t('containers.edit', {type: type.name})}</Badge>
          <Form onSubmit={updateContainer} noValidate validated={validated}>
            <Form.Group controlId="formBasicText">
                <Form.Label>Title</Form.Label>
                <InputGroup>
                  <Form.Control type='text' 
                                name="formContainerTitle"
                                onChange={change('title')}
                                value={form.title[i18n.language]}/>
                  <Form.Control.Feedback type="invalid">Please update the title.</Form.Control.Feedback>
                </InputGroup>
                <Form.Text className="text-muted">{t('containers.helper.title')}</Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicText">
                <Form.Label>Content this:</Form.Label>
                <InputGroup>
                    <Editor value={form.content[i18n.language]} 
                            onChange={change(content)}
                            language='en'
                            preview={true} />
                  <Form.Control.Feedback type="invalid">Please update the content.</Form.Control.Feedback>
                </InputGroup>
                <Form.Text className="text-muted">{t('containers.helper.content')}</Form.Text>
            </Form.Group>
            <Button type='submit' variant='warning'>
                {t('containers.button_submit')}
            </Button>
          </Form>
        </Jumbotron>
      </>)
      break
  }
}

/* Print cards with partial content and a link */
const CardSimple = ( { data, link, text, type } ) => {
  const { i18n, t } = useTranslation()
  const [mode, setMode] = useState('normal')
  const container_type = "containers." + type
  return (
    <>
      <style type="text/css">
        {`
          .${type} {
            margin: 5px;
            min-width: 300px;
            max-width: 450px;
            border: 1px solid ${colorType(type)}; }
          .card-body { 
            background-color: rgba(55, 44, 44, 0.85); 
            background-image: linear-gradient(to bottom left, rgb(99,99,99), rgb(44,32,22)); }
          .card-title .h5 { display: inline; }
          .badge { 
            vertical-align: top;  
            font-family: 'Source Code Pro';}
        `}
      </style>
      <Card className={type}>
        <Card.Img variant="top" src={`/uploads/${data.image_link}`} />
        <Card.Body>
          <Card.Title>
            {trContainer(i18n.language, data).title}&nbsp;
            <Badge variant='primary'>{t(container_type)}</Badge>
          </Card.Title>
          <Card.Text as="div">
            {parse(trContainer(i18n.language, data).content)}
          </Card.Text>
          <Card.Link href={link}>{text}</Card.Link>
          <br/>
          <ActionLinks data={data} type={type} callback={setMode}/>
        </Card.Body>
      </Card>
    </>
  )
}

const CardList = ( { containers, type, children } ) => {
  const { i18n, t } = useTranslation()
  return (
    <>
      <CardGroup>
        { containers.map( (container, index) => {
          const type_name = (children) ? container.type_name : type
          console.log("GET TYPE NAME: ", type_name)
          if (container.enable) return ( 
            <CardSimple data={container}
              type={type_name}
              key={index} 
              link={`/${type_name}/${container.id}`}
              text={t('containers.link', 
                    { type_name, title: trContainer(i18n.language, container).title})} />
          ) 
        } ) }
      </CardGroup>
    </>
  )
 }

const CardTree = ({ data, link, text }) => (
    <>
    </>
)

/* type is a string for type name for containers list to print for,
   children is an Object with two keys: {other, same} with boolean values
   to show children for same and other types.
   head is a boolean value for show params :id container content on head first. */
const Containers = ({ type, children }) => {
  const { id } = useParams()
  console.log("==> Containers component for ", type)
  const { i18n, t } = useTranslation()
  const language = i18n.language
  const crud_mode = (children == undefined) ? 'getContainersOfType' : 'getChildrenContainersOf'
  const data = (children == undefined) ? type : id
  const { loading, error, containers } = useFetch(crud_mode, data, language)

  if (loading) return <><Loading /></>
  else if(error.state) return <><Error title={t('error:home.title')} 
                                       name={error.content.name}
                                       message={error.content.message}
                                       open = {true} /></>
  else if (children == undefined) { // print categories list only (cards)
      return (
        <>
          <h1>{t('containers.list', {type})}</h1>
          <hr/>
          <CardList containers={containers} type={type} />
        </>
      )
  } else if (!children.same && children.other) {
      return (
        <>
          <HeadContent container={containers.head.container} type={containers.head.type} />
          <CardList containers={containers.containers} type={type} children={true} />
        </>
      )
  } else if (children.same && !children.other) { 
  } else if (!children.same && !children.other) { }
}

/* Props Types checking part... */

Containers.propTypes = {
  type: string.isRequired,
  children: exact({
              same:  bool.isRequired,
              other: bool.isRequired }),
}

CardSimple.propTypes = {
  data: shape({
      title:      string.isRequired,
      content:    string.isRequired,
      title_en:   string.isRequired,
      content_en: string.isRequired,
      image_link: string.isRequired
  }),
  type: string.isRequired,
  link: string.isRequired,
  text: string.isRequired
}

CardList.propTypes = {
  containers: arrayOf(object).isRequired,
  type:       string.isRequired,
  children:   bool
}

CardList.defaultProps = {
  children: false
}

ActionLinks.propTypes = {
  data:     object.isRequired,
  type:     string.isRequired,
  callback: func.isRequired
}

HeadContent.propTypes = {
  data: object.isRequired,
  type: object.isRequired,
  lng:  string.isRequired
}

export default Containers
