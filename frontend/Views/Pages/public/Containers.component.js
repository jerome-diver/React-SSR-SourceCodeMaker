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
import { trContainer } from '../../helpers/config'
import { Card, CardGroup, Jumbotron, Badge, Button, Form, InputGroup, Image, Figure } from 'react-bootstrap'
import loadable from '@loadable/component'

import { actionsContainerLinks, actionsContainer, useFetch } from './compositions/containers.actions'
import { statesContainerLinks, statesHeadContainer, statesContainer } from './compositions/containers.states'

const Editor = loadable(() => import('for-editor'))

/* Pure UI components with HOC to compose with states and actions components.
   -> ContainerLinks (with both edit and normal mode) show buttons for action on own Container
   -> HeadContainer (and both normal and edit mode) show Top head container (root of tree called)
   -> Container (and both normal and edit mode) to show a container of the children list content
   -> Containers UI design to organize the full page to show containers content from specific call scenari
*/ 

/* Buttons actions links UI design for normal and edit mode */
const ContainerLinksUInormal = ( { t, data, type, edit, remove, cancel } ) => (
      <>
        <Button onClick={edit} variant="warning">
          { t('containers.content.edit', { content: data.title }) }
        </Button>
        <Button onClick={() => remove(content, type)} variant="danger">
          { t('containers.content.delete', { content: data.content }) }
        </Button>
        <Button onClick={cancel}>{ t('containers.content.cancel') }</Button>
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

/* Head Containers UI design for normal and edit mode */
const HeadContainerUInormal = ({t, i18n, type_to_translate, 
                                container, setMode, mode}) => (
  <>
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
      <ContainerLinks data={container} type={container.type_name} callback={setMode} mode={mode}/>
    </Jumbotron>
  </>
)

const HeadContainerUIedit = ( {t, i18n, type_to_translate, 
                               validated, update, change, form, 
                               container, setMode, mode}) => (
  <>
    <Jumbotron id='edit-container'>
      <Badge variant='warning'>{t('containers.edit', {type: container.type_name})}</Badge>
      <Form onSubmit={update(container)} noValidate validated={validated}>
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
        <ContainerLinks data={container} type={container.type_name} callback={setMode} mode={mode}/>
      </Form>
    </Jumbotron>
  </>
)

/* Container UI design for mode edit and normal */
const ContainerUInormal = ( { t, i18n, type, container_type, 
                              index, container, setMode, mode } ) => (
  <>
      <Card id={type+'_'+index}>
        <Card.Img variant="top" src={`/uploads/${container.image_link}`} />
        <Card.Body>
          <Card.Title>
            {trContainer(i18n.language, container).title}&nbsp;
            <Badge variant='primary'>{t(container_type)}</Badge>
          </Card.Title>
          <Card.Text as="div">
            {parse(trContainer(i18n.language, container).content)}
          </Card.Text>
          <Card.Link href={`/${container.type_name}/${container.id}`}>
            {t('containers.link', { type, title: trContainer(i18n.language, container).title})}
            </Card.Link>
          <br/>
        <ContainerLinks data={container} type={container_type} callback={setMode} mode={mode}/>
        </Card.Body>
      </Card>
    </>
)

const ContainerUIedit = ( { t, i18n, type, container_type, 
                            validated, update, change, form, 
                            index, container, setMode, mode } ) => (
  <>
      <Card id={type+'_'+index}>
        <Form onSubmit={update(container)} noValidate validated={validated}>
          <Card.Img variant="top" src={`/uploads/${container.image_link}`} />
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
              <ContainerLinks container={container} type={container.type_name} callback={setMode} mode={mode}/>
            </Card.Text>
            <Card.Link href={`/${container.type_name}/${container.id}`}>{t('containers.link', 
                             { type, title: trContainer(i18n.language, container).title})}</Card.Link>
            <br/>
          </Card.Body>
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
const HeadContainer = actionsContainer(statesHeadContainer(HeadContainerUInormal, HeadContainerUIedit))
const Container = actionsContainer(statesContainer(ContainerUInormal, ContainerUIedit))

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
