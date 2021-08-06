/* HOC to Compose with Containers.component for ACTIONS */

import React, { useEffect } from 'react'
import { trContainer } from '../../../helpers/config'

/* Component to use with ACTIONS (Private) */
/* Public ACTIONS HOC */
const actionsContainerLinks = UI => {   // actions comes first !
    const actions = (props) => {
        const edit = () => { props.callback('edit') }
        const cancel = () => { props.callback('normal') }
        props = { ...props, edit, cancel }
        return <UI {...props} />
    }
    return actions
}

const actionsContainer = (UInormal, UIedit) => {  // actions comes after states !
    const actions = (props) => {
        const { t, i18n, state, dispatch, response, form, setForm, data, setData, mode, setMode, setValidated } = props
        useEffect(()=>{ 
            const content = can_refresh()
            if (content != undefined) refresh(content)
        }, [response])
        /* View refresher after action CRUD*/
        const can_refresh = () => { // test if can refresh with something, then give back this thing
            console.log("show me if can refresh for:", state.called)
            switch (state.called) {
                case 'create':
                    return (response.created) ? response.content : undefined
                case 'read':
                    return (response.find) ? response.content : undefined
                case 'update':
                    return (response.updated) ? response.content : undefined
                case 'delete':
                    return (response.deleted) ? null : undefined
            }
        }
        const refresh = (d) => { // refresh content with data
            console.log("yes i can with:", d)
            if (d) {
                setForm({ title:   { fr: d.title, en: d.title_en }, 
                          content: { fr: d.content, en: d.content_en } })
                setData (d)
            } else setMode('empty')
        }
        /* onChange form control (or input tags) events */
        const change = target => value => {
            if (target == 'title') props.setForm({...form, title: { [i18n.language]: value} })
            else setForm({...form, content: { [i18n.language]: value } })
            setData({title: data.title, title_en: data.title_en, 
                     content: data.content, content_en: data.content_en, 
                     type_name: data.type_name, parent_id: data.parent_id, 
                     enable: data.enable, [target]: value})
        }
        /* onClick buttons tags events */
        const update = container => e => { // via submit form button
            e.preventDefault();
            const form_to_submit = e.currentTarget;
            if (form_to_submit.checkValidity() === false) {
                e.stopPropagation();
            } else {
            dispatch({ type: 'update', reference: { id: container.id, body: data } })
            setValidated(true)
            setMode('normal')
            }
        }
        const remove = () => { // via "remove" ContainerLinks props callback action
            const answer = confirm(t('containers.delete_confirm', 
                                    { type: response.content.type_name, 
                                      title: trContainer(i18n.language, response.content).title}) )
            if (answer) {
                dispatch({ type: 'delete', reference: container.id })
                setMode('empty')
            }
        }
        props = {...props, update, change, remove}
        switch (mode) {
            case 'empty':
                return null
            case 'edit':
                return <>
                    <UIedit {...props} container={response.content} />
                </>
            case 'normal':
                return <>
                    <UInormal {...props} container={response.content} />
                </>
            default: 
                return null
        }
    }
    return actions
}

export { actionsContainerLinks, actionsContainer }