/* HOC to Compose with Containers.component for ACTIONS */

import React, { useEffect, useLayoutEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
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
        const { t, i18n, state, dispatch, response, form, setForm, data, setData, mode, setMode,
                setValidated, picture, setPicture, setPictures } = props
        useEffect(()=>{ 
            const content = can_refresh()
            if (content != undefined) refresh(content)
        }, [response])
        useLayoutEffect(() => {
            /* on delete icon clicked */
            const deleteImage = document.getElementById('deleteImage')
            if (deleteImage) {
                console.log("'click' event listener added to deleteimage HTML element (the delete icon)")
                deleteImage.addEventListener('click', () => {
                    console.log("deleted !")
                    document.getElementById('toUpload').value = null
                })
            }
        }, [picture])
        console.log("GET PICTURE at refresh: ", picture)
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
                const image = '/uploads/' + d.image_link
                setForm({ title:   { fr: d.title, en: d.title_en }, 
                          content: { fr: d.content, en: d.content_en },
                          image: image} )
                setData (d)
                setPicture(image)
                //console.log("REFRESH PICTURE/", picture)
            } else setMode('empty')
        }
        /*on picture dropped */
        const onDrop = useCallback(acceptedFiles => {
            console.log("Dropped files:", acceptedFiles)
            if (acceptedFiles.length == 0) {
                console.log("No file in list...")
                document.getElementById('toUpload').value = null
            } else {
                const acceptedFilesURL = acceptedFiles.map(file => URL.createObjectURL(file))
                setPictures(acceptedFilesURL)
                setData((previous) => ({ ...previous, image: acceptedFiles[0]}) )
            }
        }, [])
        /* getters for Dropzone area */
        const {getRootProps, getInputProps, isDragActive, acceptedFiles, rejectedFiles} = useDropzone({onDrop, accept: 'image/jpeg, image/png'})
        console.log("this is getRootProps:", getRootProps)
        console.log("and thi is get InputProps:", getInputProps)
        console.log("is isDragActive ?", isDragActive)
        /* onChange form control (or input tags) events */
        const change = e => {
            console.log("EVENT is", e)
            if (e.target != undefined) {
                if (e.target.name == 'image') {
                    const source = '/uploads/' + e.target.value
                    setForm({...form, image: source })
                } else {
                    setForm((previous) => ({...previous, [e.target.name]: { [i18n.language]: e.target.value} }) )
                }
                setData((previous) => ({...previous, [e.target.name]: e.target.value}) ) }
            else {
                setForm((previous) => ({...previous, [e.name]: { [i18n.language]: e.value} }) ) 
                setData((previous) => ({...previous, [e.name]: e.value}) ) 
            }
        }
        /* onClick buttons tags events */
        const update = container => e => { // via submit form button
            console.log("SUBMIT with", container, e)
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
        props = {...props, update, change, remove, 
                    onDrop, getRootProps, getInputProps, isDragActive, acceptedFiles, rejectedFiles }
        const answer = (response.content != undefined) ? response.content : response
        switch (mode) {
            case 'empty':
                return null
            case 'edit':
                return <>
                    <UIedit {...props} container={answer} />
                </>
            case 'normal':
                return <>
                    <UInormal {...props} container={answer} />
                </>
            default: 
                return null
        }
    }
    return actions
}

export { actionsContainerLinks, actionsContainer }