/* HOC to Compose with Containers.components STATES */

import React, { useState, useReducer, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthenticate, itsMine, canModify } from '../../../../Controllers/context/authenticate'
import { crud_caller, crud_list } from '../../../../Controllers/container/action-CRUD'
import { useForm, Controller } from 'react-hook-form';
import { vestResolver } from '@hookform/resolvers/vest'
import { tests } from '../../../../Models/containers.validations'
import { Error, Loading } from '../Printers.component'



const dataReducer = (state, action) => {
    console.log("dispatch for", action)
  switch (action.type) {
    case 'create':
      return { crud: 'createContainer', data: action.reference, called: 'create' }
    case 'get':
      return { crud: 'getContainer', data: action.reference, called: 'read' }
    case 'update':
      return { crud: 'updateContainer', data: action.reference, called: 'update' }
    case 'delete':
      return { crud: 'deleteContainer', data: action.reference, called: 'delete' }
  }
}

const useFetch = (crud_name, data, triggers) => {
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState({state: false, content: ""})
    const [ response, setResponse ] = useState({})
    const isMounted = useRef(true)
    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, [])
    useEffect(() => {
        console.log("==> useFetch for CRUD's container function name and content:", {crud_name, data})
        if (crud_list.includes(crud_name)) {
            crud_caller['$' + crud_name](data, setResponse, setError, setLoading, isMounted) 
        }
    }, triggers )
    return { loading, error, response }
}

const statesContainerLinks = (UInormal, UIedit) => {   // states comes after actions for links!
    const states = (props) => {
        const { t, i18n } = useTranslation()
        const { getUser, getRole } = useAuthenticate()
        const user = getUser()
        const role = getRole()
        props = { ...props, t, i18n}
        if (canModify(role, props.type) || itsMine(user, props.data)) { 
            switch(props.mode) {
                case 'empty':
                    return <></>
                case 'normal':
                    return <UInormal {...props} />
                case 'edit':
                    return <UIedit {...props} />
                default: 
                    return <></>
            }
        } else return null
    }
    return states
}

const statesContainer = UI => {   // states comes first for container !
    const states = (props) => {
        const { t, i18n } = useTranslation()
        const [ validated, setValidated ] = useState(false)
        const [ mode, setMode ] = useState('normal')
        const [ state, dispatch ] = useReducer(dataReducer, {crud: 'getContainer', data: props.id, called: 'read'})
        const { loading, error, response } = useFetch(state.crud, state.data, [i18n.language, state])
        const [ data, setData ] = useState({})
        const [ form, setForm ] = useState({})
        const [ picture, setPicture] = useState("")
        const [ pictures, setPictures] = useState([])
        const { register, control, handleSubmit, formState } = useForm({mode:'all', resolver: vestResolver(tests)})
        props = {...props, t, i18n, 
                 mode, setMode, picture, setPicture, pictures, setPictures, data, setData,
                 state, dispatch, response, 
                 form, setForm, validated, setValidated, register, Controller, control, handleSubmit, formState }
        if (loading) return <><Loading /></>
        if(error.state) return <><Error title={t('error:home.title')} 
                                              name={error.content.name}
                                              message={error.content.message}
                                              open={true} /></>
        else {
            return <UI {...props} />
        }
    }
    return states
}


export { statesContainerLinks, statesContainer, useFetch }