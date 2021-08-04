/* HOC to Compose with Containers.components STATES */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { colorType } from '../../../helpers/config'
import { useAuthenticate, itsMine, canModify } from '../../../../Controllers/context/authenticate'
import { Error, Loading } from '../Printers.component'


const statesContainerLinks = (UInormal, UIedit) => {
    const states = (props) => {
        const { t } = useTranslation()
        const { getUser, getRole } = useAuthenticate()
        const user = getUser()
        const role = getRole()
        props = { ...props, t}
        if (canModify(role, props.type) || itsMine(user, props.data)) { 
            switch(props.mode) {
                case 'normal':
                    return <UInormal {...props} />
                case 'edit':
                    return <UIedit {...props} />
            }
        } else return null
    }
    return states
}

const statesHeadContainer = (UInormal, UIedit) => {
    const states = (props) => {
        const { t } = useTranslation()
        const type_to_translate = "containers." + props.response.type_name
        props = {...props, t, type_to_translate}
        if (props.loading) return <><Loading /></>
        if(props.error.state) return <><Error title={t('error:home.title')} 
                                              name={props.error.content.name}
                                              message={props.error.content.message}
                                              open={true} /></>
        else {
            switch (props.mode) {
                case 'edit':
                    return <>
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
                        <UIedit {...props} container={props.response} />
                    </>
                case 'normal':
                    return <>
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
                        <UInormal {...props} container={props.response} />
            </>
            }
        }
    }
    return states
}

const statesContainer = (UInormal, UIedit) => {
    const states = (props) => {
        const { t } = useTranslation()
        const type = props.response.type_name
        const container_type = "containers." + type
        props = {...props, t, type, container_type}
        if (props.loading) return <><Loading /></>
        if(props.error.state) return <><Error title={t('error:home.title')} 
                                              name={props.error.content.name}
                                              message={props.error.content.message}
                                              open={true} /></>
        else {
            switch (props.mode) {
                case 'edit':
                    return <>
                        <style type='text/css'>{`
                            #${type+'_'+props.index} {
                                margin: 5px;
                                min-width: 520px;
                                max-width: 600px;
                                border: 1px solid ${colorType(type)}; }
                            .badge { 
                            vertical-align: middle;  
                            font-family: 'Source Code Pro';}
                            #${type+'_'+props.index} .card-body {
                                background-color: rgba(55, 44, 44, 0.85); 
                                background-image: linear-gradient(to bottom left, rgb(199,19,99), rgb(44,32,22)); }
                            #${type+'_'+props.index} .card-title .h5 { display: inline; }
                        `}</style>
                        <UIedit {...props} container={props.response} />
                    </>
                case 'normal':
                    return <>
                        <style type='text/css'>{` 
                            #${type+'_'+props.index} {
                                margin: 5px;
                                min-width: 520px;
                                max-width: 600px;
                                border: 1px solid ${colorType(type)}; }
                            .badge { 
                            vertical-align: middle;  
                            font-family: 'Source Code Pro';}
                            #${type+'_'+props.index} .card-body { 
                                background-color: rgba(55, 44, 44, 0.85); 
                                background-image: linear-gradient(to bottom left, rgb(99,99,99), rgb(44,32,22)); }
                            #${type+'_'+props.index} .card-title .h5 { display: inline; }
                        `}</style>
                        <UInormal {...props} container={props.response} />
            </>
            }
        }
    }
    return states
}



export { statesContainerLinks, statesHeadContainer, statesContainer }