/* it is all about a MongoDB Container linked with a Type 
   Containers component there is the main Component to use
   to adapt return back for each situation depending on route and options
*/

import React, { useState, useEffect, useRef, useReducer } from 'react'
import { string, bool, object, func, exact, shape, arrayOf, number } from 'prop-types'
import { Loading, Error } from './Printers.component'
import { useAuthenticate, itsMine, canModify } from '../../../Controllers/context/authenticate'
import { useTranslation } from "react-i18next"
import parse from 'html-react-parser'
import { useParams } from 'react-router-dom'
import { colorType, trContainer } from '../../helpers/config'
import { crud_caller, crud_list } from '../../../Controllers/container/action-CRUD'
import { Card, CardGroup, Jumbotron, Badge, Button, Form, InputGroup, Image, Figure } from 'react-bootstrap'
import loadable from '@loadable/component'
const Editor = loadable(() => import('for-editor'))


/* fetching data to get database collection entries back */
const useFetch = (crud_name, data, trigger) => {
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState({state: false, content: ""})
    const [ response, setResponse ] = useState({})
    const isMounted = useRef(null)
    useEffect(() => {
        isMounted.current = true
        console.log("==> useFetch for CRUD's container function name:", crud_name)
        if (crud_list.includes(crud_name)) {
            crud_caller['$' + crud_name](data, setResponse, setError, setLoading, isMounted.current) 
        }
        return () => (isMounted.current = false)
    }, [trigger] )
    return { loading, error, response }
}

const deleteContent = (content, type) => { console.log("DELETE") }

const ActionLinks = ( { data, type, callback, mode } ) => {
  const { getUser, getRole } = useAuthenticate()
  const { t } = useTranslation()
  const user = getUser()
  const role = getRole()
  const editContent = () => { callback('edit') }
  const cancel = () => { callback('normal') }
  if (canModify(role, type) || itsMine(user, data)) {
    switch (mode) {
      case 'normal':
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
      case 'edit':
        return (
          <>
            <Button type='submit' variant='warning'>
                {t('containers.button_submit')}
            </Button>
            <Button onClick={cancel}>{ t('containers.content.cancel') }</Button>
          </>
        )
    }
  } else return null
}

const HeadContainerNormal = ({container, setMode, mode}) => {
  const { i18n, t } = useTranslation()
  const type_to_translate = "containers." + container.type_name
  return <>
    <style type='text/css'>
      {` #head-container {
           background-image: linear-gradient(to bottom left, rgb(99,99,99), rgb(44,32,22));
           background-color: rgba(99,99,99,0.75)
        }       `}
    </style>
    <Jumbotron id='head-container'>
      <h1 id='head-container-title'>
        {trContainer(i18n.language, container).title}&nbsp;
        <Badge variant='info'>{t(type_to_translate)}</Badge>
      </h1>
      <Figure>
        <Figure.Image rounded fluid src={`/uploads/${container.image_link}`} />
        <Figure.Caption>
          {parse(trContainer(i18n.language, container).content)}
        </Figure.Caption>
      </Figure>
      <br/>
      <ActionLinks data={container} type={container.type_name} callback={setMode} mode={mode}/>
    </Jumbotron>
  </>
}

const HeadContainerEdit = ({container, setMode, mode}) => {
  const { i18n, t } = useTranslation()
  const type_to_translate = "containers." + container.type_name
  const [ validated, setValidated ] = useState(false)
  const [ form, setForm ] = useState({ title:   { fr: container.title,   
                                                  en: container.title_en }, 
                                       content: { fr: container.content, 
                                                  en: container.content_en } })
  const change = target => e => {
    if (target == 'title') setForm({...form, title: { [i18n.language]: e.target.value} })
    else setForm({...form, content: { [i18n.language]: e } })
  }
  const updateContainer = (container) => e => {
    const form_to_submit = e.currentTarget;
    if (form_to_submit.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    } else {
      console.log("UPDATE CONTAINER EVENT FOR", container)
      const data = { id: container.id, body: {...container} }
  //    const { loading, error } = useFetch('updateContainer', response, i18n.language)
    }
    setValidated(true)
  }
  return <>
    <style type='text/css'>
      {` #edit-container {
           background-image: linear-gradient(to bottom left, rgb(199,19,99), rgb(44,32,22));
           background-color: rgba(199,2,2,0.75) }
      `}
    </style>
    <Jumbotron id='edit-container'>
      <Badge variant='warning'>{t('containers.edit', {type: type.name})}</Badge>
      <Form onSubmit={updateContainer(container)} noValidate validated={validated}>
        <Form.Group controlId="formBasicText">
            <Form.Label>Title</Form.Label>
            <InputGroup>
              <Form.Control type='text' 
                            name="formContainerTitle"
                            onChange={change('title')}
                            value={form.title[i18n.language]}/>
              <Badge variant='info'>{t(type_to_translate)}</Badge>
              <Form.Control.Feedback type="invalid">Please update the title.</Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">{t('containers.helper.title')}</Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicText">
            <Form.Label>Content this:</Form.Label>
            <InputGroup>
                <Editor value={form.content[i18n.language]} 
                        onChange={change('content')}
                        language='en'
                        preview={true} />
              <Form.Control.Feedback type="invalid">Please update the content.</Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">{t('containers.helper.content')}</Form.Text>
        </Form.Group>
        <ActionLinks data={container} type={type.name} callback={setMode} mode={mode}/>
      </Form>
    </Jumbotron>
  </>
}

/* Print the content of a container on top */
const HeadContainer = ( {id} ) => {
  const [ mode, setMode ] = useState('normal')
  const { i18n, t } = useTranslation()
  const { loading, error, response } = useFetch('getContainer', id, i18n.language)

  if (loading) return <><Loading /></>
  if(error.state) return <><Error title={t('error:home.title')} 
                                  name={error.content.name}
                                  message={error.content.message}
                                  open = {true} /></>
  else {
    switch (mode) {
      case 'normal':
        return <>
          <style type='text/css'>
            {` #head-container-title h1 { display: inline-block; }
              #head-container-text { font-family: 'Santana'; }
              .badge { 
                vertical-align: middle; 
                font-family: 'Source Code Pro'; }
            `}
          </style>
          <HeadContainerNormal container={response} setMode={setMode} mode={mode} />
        </>
      case 'edit':
        return <>
          <style type='text/css'>
            {` #edit-container-title h1 { display: inline-block; }
              #edit-container-text { font-family: 'Santana'; }
              .badge { 
                vertical-align: middle; 
                font-family: 'Source Code Pro'; }
            `}
          </style>
          <HeadContainerEdit container={response} setMode={setMode} mode={mode} />
        </>
    }
  }
}

const ContainerNormal = ( { index, data, type, setMode, mode } ) => {
  const { i18n, t } = useTranslation()
  const container_type = "containers." + type
  return <>
      <style type="text/css">
        {`
          #${type+'_'+index} .card-body { 
            background-color: rgba(55, 44, 44, 0.85); 
            background-image: linear-gradient(to bottom left, rgb(99,99,99), rgb(44,32,22)); }
          #${type+'_'+index} .card-title .h5 { display: inline; }
        `}
      </style>
      <Card id={type+'_'+index}>
        <Card.Img variant="top" src={`/uploads/${data.image_link}`} />
        <Card.Body>
          <Card.Title>
            {trContainer(i18n.language, data).title}&nbsp;
            <Badge variant='primary'>{t(container_type)}</Badge>
          </Card.Title>
          <Card.Text as="div">
            {parse(trContainer(i18n.language, data).content)}
          </Card.Text>
          <Card.Link href={`/${data.type_name}/${data.id}`}>
            {t('containers.link', { type, title: trContainer(i18n.language, data).title})}
            </Card.Link>
          <br/>
        <ActionLinks data={data} type={container_type} callback={setMode} mode={mode}/>
        </Card.Body>
      </Card>
    </>
}

const ContainerEdit = ( { index, data, type, setMode, mode } ) => {
  const { i18n, t } = useTranslation()
  const [ validated, setValidated ] = useState(false)
  const container_type = "containers." + type
  const [ form, setForm ] = useState({ title:   { fr: data.title,   
                                                  en: data.title_en }, 
                                       content: { fr: data.content, 
                                                  en: data.content_en } })
  const change = target => e => {
    if (target == 'title') setForm({...form, title: { [i18n.language]: e.target.value} })
    else setForm({...form, content: { [i18n.language]: e } })
  }
  const updateContainer = (container) => e => {
    const form_to_submit = e.currentTarget;
    if (form_to_submit.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    } else {
      console.log("UPDATE CONTAINER EVENT FOR", container)
      const data = { id: container.id, body: {...container} }
  //    const { loading, error } = useFetch('updateContainer', data, i18n.language)
    }
    setValidated(true)
  }
  return <>
      <style type="text/css">
        {`
          #${type+'_'+index} .card-body { 
            background-color: rgba(55, 44, 44, 0.85); 
            background-image: linear-gradient(to bottom left, rgb(199,19,99), rgb(44,32,22)); }
          #${type+'_'+index} .card-title .h5 { display: inline; }
        `}
      </style>
      <Card id={type+'_'+index}>
        <Form onSubmit={updateContainer(data)} noValidate validated={validated}>
          <Card.Img variant="top" src={`/uploads/${data.image_link}`} />
          <Card.Body>
            <Card.Title>
              <Form.Group controlId="formBasicText">
                  <Form.Label>Title</Form.Label>
                  <InputGroup>
                    <Form.Control type='text' 
                                  name="formContainerTitle"
                                  onChange={change('title')}
                                  value={form.title[i18n.language]}/>
              <Badge variant='primary'>{t(container_type)}</Badge>
                    <Form.Control.Feedback type="invalid">Please update the title.</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">{t('containers.helper.title')}</Form.Text>
              </Form.Group>
            </Card.Title>
            <Card.Text as="div">
              <Form.Group controlId="formBasicText">
                  <Form.Label>Content this:</Form.Label>
                  <InputGroup>
                      <Editor value={form.content[i18n.language]} 
                              onChange={change('content')}
                              language='en'
                              preview={true} />
                    <Form.Control.Feedback type="invalid">Please update the content.</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">{t('containers.helper.content')}</Form.Text>
              </Form.Group>
              <ActionLinks data={data} type={data.type_name} callback={setMode} mode={mode}/>
            </Card.Text>
            <Card.Link href={`/${data.type_name}/${data.id}`}>{t('containers.link', 
                             { type, title: trContainer(i18n.language, data).title})}</Card.Link>
            <br/>
          </Card.Body>
        </Form>
      </Card>
    </>
}

/* Print cards with partial content and a link */
const Container = ( props ) => {
  const { i18n, t } = useTranslation()
  const [mode, setMode] = useState('normal')
  const { loading, error, response } = useFetch('getContainer', props.id, i18n.language)
  const type = response.type_name

  if (loading) return <><Loading /></>
  if(error.state) return <><Error title={t('error:home.title')} 
                                  name={error.content.name}
                                  message={error.content.message}
                                  open = {true} /></>
  switch (mode) {
    case 'normal':
      return <>
        <style type="text/css">
          {`
              #${type+'_'+props.index} {
                margin: 5px;
                min-width: 520px;
                max-width: 600px;
                border: 1px solid ${colorType(type)}; }
            .badge { 
              vertical-align: middle;  
              font-family: 'Source Code Pro';}
          `}
        </style>
        <ContainerNormal {...props} data={response} type={type} setMode={setMode} mode={mode} />
      </>
    case 'edit':
      return <>
        <style type="text/css">
          {`
              #${type+'_'+props.index} {
                margin: 5px;
                min-width: 520px;
                max-width: 600px;
                border: 1px solid ${colorType(type)}; }
            .badge { 
              vertical-align: middle;  
              font-family: 'Source Code Pro';}
          `}
        </style>
        <ContainerEdit {...props} data={response} type={type} setMode={setMode} mode={mode}/>
      </>
  }
}

const GroupContainer = ( props ) => {
  const { i18n, t } = useTranslation()
  const crud_mode = (props.children) ? 'getChildrenIDof' : 'getContainersIDofType'
  const reference = (props.children) ? props.id : props.type
  const { loading, error, response } = useFetch(crud_mode, reference, i18n.language)

  if (loading) return <><Loading /></>
  else if (error.state) return <><Error title={t('error:home.title')} 
                                   name={error.content.name}
                                   message={error.content.message}
                                   open = {true} /></>
  else {
    return <> <CardGroup>
              { response.map( (data, index) => {
                if (data.enabled) return <Container id={data.id} key={index} index={index} />
              }) }
          </CardGroup> </>
  }
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
  const { i18n, t } = useTranslation()

  if (children == undefined) { // print containers list only
      return (
        <>
          <h1>{t('containers.list', {type})}</h1>
          <hr/>
          <GroupContainer type={type} children={false} />
        </>
      )
  } else if (!children.same && children.other) {
      return (
        <>
          <HeadContainer id={id} />
          <GroupContainer id={id} children={true} />
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

Container.propTypes = {
  id: string.isRequired,
  index: number.isRequired
}

GroupContainer.propTypes = {
  type:       string,
  children:   bool
}

GroupContainer.defaultProps = {
  children: false
}

ActionLinks.propTypes = {
  data:     object.isRequired,
  type:     string.isRequired,
  callback: func.isRequired
}

HeadContainer.propTypes = {
  id: string.isRequired,
}

export default Containers
