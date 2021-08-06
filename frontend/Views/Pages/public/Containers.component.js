/* it is all about a MongoDB Container linked with a Type 
   Containers component there is the main Component to use
   to adapt return back for each situation depending on route and options
*/

import React from 'react'
import { string, bool, object, func, exact, number } from 'prop-types'
import { Loading, Error } from './Printers.component'
import { useTranslation } from "react-i18next"
import parse from 'html-react-parser'
import { useParams } from 'react-router-dom'
import { trContainer, colorType } from '../../helpers/config'
import { Card, CardGroup, Jumbotron, Badge, Button, Form, InputGroup, Image, Figure, Modal } from 'react-bootstrap'
import loadable from '@loadable/component'

import { actionsContainerLinks, actionsContainer } from './compositions/containers.actions'
import { statesContainerLinks, statesContainer, useFetch } from './compositions/containers.states'

const Editor = loadable(() => import('for-editor'))

/* Pure UI components with HOC to compose with states and actions components.
   -> ContainerLinks (with both edit and normal mode) show buttons for action on own Container
   -> HeadContainer (and both normal and edit mode) show Top head container (root of tree called)
   -> Container (and both normal and edit mode) to show a container of the children list content
   -> Containers UI design to organize the full page to show containers content from specific call scenari
*/ 

/* Buttons actions links UI design for normal and edit mode */
const ContainerLinksUInormal = ( { t, data, edit, remove } ) => (
      <>
        <Button onClick={edit} variant="warning">
          { t('containers.content.edit', { content: data.title }) }
        </Button>
        <Button onClick={remove} variant="danger">
          { t('containers.content.delete', { content: data.content }) }
        </Button>
      </>
)

const ContainerLinksUIedit = ( { t, cancel } ) => (
      <>
        <Button type='submit' variant='warning'>
            {t('containers.button_submit')}
        </Button>
        <Button onClick={cancel}>{ t('containers.content.cancel') }</Button>
      </>
)

const ContainerCreatorUI = ( {t}) => (
  <>
    <Modal show={create}>
      <Modal.Header closeButton>
        <Modal.Title>{t('containers.create.new')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submit} noValidate validated={validated}>
          <Form.Group controlId="formBasicText">
              <Form.Label>Title</Form.Label>
              <InputGroup>
                <Form.Control type='text' 
                              name="formContainerTitle"
                              onChange={change('title')}
                              value={form.title[i18n.language]}/>
                <Badge variant='info'>{t(container.type_name)}</Badge>
                <Form.Control.Feedback type="invalid">{t('containers.update.invalid_title')}</Form.Control.Feedback>
              </InputGroup>
              <Form.Text className="text-muted">{t('containers.helper.title')}</Form.Text>
          </Form.Group>
          <Image rounded fluid src={`/uploads/${container.image_link}`} />
          <Form.Group controlId="formBasicText">
              <Form.Label>{t('containers.update.content')}</Form.Label>
              <InputGroup>
                  <Editor value={form.content[i18n.language]} 
                          onChange={change('content')}
                          language='en'
                          preview={true} />
                <Form.Control.Feedback type="invalid">{t('containers.update.invalid_title')}</Form.Control.Feedback>
              </InputGroup>
              <Form.Text className="text-muted">{t('containers.helper.content')}</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <ContainerLinks data={container} mode='edit' />
      </Modal.Footer>
    </Modal>
  </>
)

/* Head Containers UI design for normal and edit mode */
const HeadContainerUInormal = ({t, i18n, remove,
                                container, setMode, mode}) => (
  <>
    <style type='text/css'>{`
        #head-container-title h1 { display: inline-block; }
        #head-container-text { font-family: 'Santana'; }
        .badge { 
            vertical-align: middle; 
            font-family: 'Source Code Pro'; }
        #head-container {
        background-image: linear-gradient(to bottom left, rgb(99,99,99), rgb(44,32,22));
        background-color: rgba(99,99,99,0.75) }
    `}</style>
    <Jumbotron id='head-container'>
      <h1 id='head-container-title'>
        {trContainer(i18n.language, container).title}&nbsp;
        <Badge variant='info'>{t("containers."+container.type_name)}</Badge>
      </h1>
      <Figure>
        <Figure.Image rounded fluid src={`/uploads/${container.image_link}`} />
        <Figure.Caption>
          {parse(trContainer(i18n.language, container).content)}
        </Figure.Caption>
      </Figure>
      <br/>
      <ContainerLinks data={container} callback={setMode} mode={mode} remove={remove} />
    </Jumbotron>
  </>
)

const HeadContainerUIedit = ( {t, i18n,
                               validated, update, change, form, 
                               container, setMode, mode}) => (
  <>
    <style type='text/css'>{`
        #edit-container-title h1 { display: inline-block; }
        #edit-container-text { font-family: 'Santana'; }
        .badge { 
            vertical-align: middle; 
            font-family: 'Source Code Pro'; }
        #edit-container {
            background-image: linear-gradient(to bottom left, rgb(199,19,99), rgb(44,32,22));
            background-color: rgba(199,2,2,0.75) }
    `}</style>
    <Jumbotron id='edit-container'>
      <Badge variant='warning'>{t('containers.edit', {type: container.type_name})}</Badge>
      <Form onSubmit={update(container)} noValidate validated={validated}>
        <Form.Group controlId="formBasicText">
            <Form.Label>{t('containers.update.title')}</Form.Label>
            <InputGroup>
              <Form.Control type='text' 
                            name="formContainerTitle"
                            onChange={change('title')}
                            value={form.title[i18n.language]}/>
              <Badge variant='info'>{t(container.type_name)}</Badge>
              <Form.Control.Feedback type="invalid">{t('containers.update.invalid_title')}</Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">{t('containers.helper.title')}</Form.Text>
        </Form.Group>
        <Image rounded fluid src={`/uploads/${container.image_link}`} />
        <Form.Group controlId="formBasicText">
            <Form.Label>{t('containers.update.content')}</Form.Label>
            <InputGroup>
                <Editor value={form.content[i18n.language]} 
                        onChange={change('content')}
                        language='en'
                        preview={true} />
              <Form.Control.Feedback type="invalid">{t('containers.update.invalid_content')}</Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">{t('containers.helper.content')}</Form.Text>
        </Form.Group>
        <ContainerLinks data={container} callback={setMode} mode={mode} />
      </Form>
    </Jumbotron>
  </>
)

/* Container UI design for mode edit and normal */
const ContainerUInormal = ( { t, i18n, remove,
                              index, container, setMode, mode } ) => (
  <>
    <style type='text/css'>{` 
        #${container.type_name+'_'+index} {
            margin: 5px;
            min-width: 520px;
            max-width: 600px;
            border: 1px solid ${colorType(container.type_name)}; }
        .badge { 
        vertical-align: middle;  
        font-family: 'Source Code Pro';}
        #${container.type_name+'_'+index} .card-body, .card-footer { 
            background-color: rgba(55, 44, 44, 0.85); 
            background-image: linear-gradient(to bottom left, rgb(99,99,99), rgb(44,32,22)); }
        #${container.type_name+'_'+index} .card-title .h5 { display: inline; }
    `}</style>
      <Card id={container.type_name+'_'+index}>
        <Card.Img variant="top" src={`/uploads/${container.image_link}`} />
        <Card.Body>
          <Card.Title>
            {trContainer(i18n.language, container).title}&nbsp;
            <Badge variant='primary'>{t("containers."+container.type_name)}</Badge>
          </Card.Title>
          <Card.Text as="div">
            {parse(trContainer(i18n.language, container).content)}
          </Card.Text>
          <Card.Link href={`/${container.type_name}/${container.id}`}>
            {t('containers.link', { type: container.type_name, title: trContainer(i18n.language, container).title})}
            </Card.Link>
        </Card.Body>
        <Card.Footer><ContainerLinks data={container} callback={setMode} mode={mode} remove={remove} /></Card.Footer>
      </Card>
    </>
)

const ContainerUIedit = ( { t, i18n, 
                            validated, update, change, form, 
                            index, container, setMode, mode } ) => (
  <>
    <style type='text/css'>{`
        #${container.type_name+'_'+index} {
            margin: 5px;
            min-width: 520px;
            max-width: 600px;
            border: 1px solid ${colorType(container.type_name)}; }
        .badge { 
        vertical-align: middle;  
        font-family: 'Source Code Pro';}
        #${container.type_name+'_'+index} .card-body {
            background-color: rgba(55, 44, 44, 0.85); 
            background-image: linear-gradient(to bottom left, rgb(199,19,99), rgb(44,32,22)); }
        #${container.type_name+'_'+index} .card-title .h5 { display: inline; }
    `}</style>
      <Card id={container.type_name+'_'+index}>
        <Form onSubmit={update(container)} noValidate validated={validated}>
          <Card.Img variant="top" src={`/uploads/${container.image_link}`} />
          <Card.Body>
            <Card.Title>
              <Form.Group controlId="formBasicText">
                  <Form.Label>{t('containers.update.title')}</Form.Label>
                  <InputGroup>
                    <Form.Control type='text' 
                                  name="formContainerTitle"
                                  onChange={change('title')}
                                  value={form.title[i18n.language]}/>
              <Badge variant='primary'>{t("containers."+container.type_name)}</Badge>
                    <Form.Control.Feedback type="invalid">{t('containers.update.invalid_title')}</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">{t('containers.helper.title')}</Form.Text>
              </Form.Group>
            </Card.Title>
            <Card.Text as="div">
              <Form.Group controlId="formBasicText">
                  <Form.Label>{t('containers.update.content')}</Form.Label>
                  <InputGroup>
                      <Editor value={form.content[i18n.language]} 
                              onChange={change('content')}
                              language='en'
                              preview={true} />
                    <Form.Control.Feedback type="invalid">{t('containers.update.invalid_content')}</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">{t('containers.helper.content')}</Form.Text>
              </Form.Group>
            </Card.Text>
          </Card.Body>
          <Card.Footer><ContainerLinks container={container} callback={setMode} mode={mode}/></Card.Footer>
        </Form>
      </Card>
    </>
)

/* Group of Containers */
const GroupContainer = ( props ) => {
  const { i18n, t } = useTranslation()
  const crud_mode = (props.children) ? 'getChildrenIDof' : 'getContainersIDofType'
  const reference = (props.children) ? props.id : props.type
  const { loading, error, response } = useFetch(crud_mode, reference, [])

  if (loading) return <><Loading /></>
  else if (error.state) return <><Error title={t('error:home.title')} 
                                   name={error.content.name}
                                   message={error.content.message}
                                   open={true} /></>
  else {
    return <CardGroup>
              { response.map( (data, index) => {
                if (data.enabled) return <Container id={data.id} key={index} index={index} />
              }) }
          </CardGroup> 
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

/* Compose UI with actions and states to provide each Component */

const ContainerLinks = actionsContainerLinks(statesContainerLinks(ContainerLinksUInormal, ContainerLinksUIedit))
const HeadContainer = statesContainer(actionsContainer(HeadContainerUInormal, HeadContainerUIedit))
const Container = statesContainer(actionsContainer(ContainerUInormal, ContainerUIedit))

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

ContainerLinks.propTypes = {
  type:       string.isRequired,
  callback:   func.isRequired
}

HeadContainer.propTypes = {
  id: string.isRequired,
}

export default Containers
