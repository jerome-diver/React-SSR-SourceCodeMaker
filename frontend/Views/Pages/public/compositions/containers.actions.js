/* HOC to Compose with Containers.component for ACTIONS */

import React, { useState, useRef, useEffect, useReducer } from 'react'
import { crud_caller, crud_list } from '../../../../Controllers/container/action-CRUD'
import { useTranslation } from 'react-i18next'

/* Component to use with ACTIONS (Private) */
const useFetch = (crud_name, data, triggers) => {
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState({state: false, content: ""})
    const [ response, setResponse ] = useState({})
    const isMounted = useRef(null)
    useEffect(() => {
        isMounted.current = true
        console.log("==> useFetch for CRUD's container function name and content:", {crud_name, data})
        if (crud_list.includes(crud_name)) {
            crud_caller['$' + crud_name](data, setResponse, setError, setLoading, isMounted.current) 
        }
        return () => (isMounted.current = false)
    }, triggers )
    return { loading, error, response }
}

const dataReducer = (state, action) => {
    console.log("dispatch for", action)
  switch (action.type) {
    case 'update':
      return { crud: 'updateContainer', data: action.reference }
    case 'delete':
      return { crud: 'deleteContainer', data: action.reference }
    case 'get':
      return { crud: 'getContainer', data: action.reference }
  }
}

/* Public ACTIONS HOC */
const actionsContainerLinks = UI => {
    const actions = (props) => {
        const edit = () => { props.callback('edit') }
        const remove = (content, type) => { console.log("DELETE") }
        const cancel = () => { props.callback('normal') }
        props = { ...props, edit, remove, cancel }
        return <UI {...props} />
    }
    return actions
}

const actionsContainer = UI => {
    const actions = (props) => {
        const { i18n } = useTranslation()
        const [ validated, setValidated ] = useState(false)
        const [ mode, setMode ] = useState('normal')
        const [ state, dispatch ] = useReducer(dataReducer, {crud: 'getContainer', data: props.id})
        const { loading, error, response } = useFetch(state.crud, state.data, [i18n.language, state])
        const [ data, setData ] = useState({})
        const [ form, setForm ] = useState({})
        useEffect(()=>{
            setForm({ title:   { fr: response.title,   
                                 en: response.title_en }, 
                      content: { fr: response.content, 
                                 en: response.content_en } })
            setData (response)  
        }, [response])
        const change = target => value => {
            if (target == 'title') setForm({...form, title: { [i18n.language]: value} })
            else setForm({...form, content: { [i18n.language]: value } })
            setData({title: data.title, title_en: data.title_en, content: data.content, content_en: data.content_en, 
                    type_name: data.type_name, parent_id: data.parent_id, enable: data.enable, [target]: value})
        }
        const update = (container) => e => {
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
        props = {...props, i18n, form, mode, setMode, 
                 update, change, validated, loading, error, response, dispatch}
        return <UI {...props} />
    }
    return actions
}

export { useFetch, actionsContainerLinks, actionsContainer }