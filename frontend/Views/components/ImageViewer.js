/* Image viewer to print image inside Accordion Bootstrap element.
*/

import React, { useState } from 'react'
import { Button, Image, Accordion } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import '../../stylesheet/imageViewer.sass'

const ImageViewer = ({ acceptedFiles, pictures, setPictures, setPicture }) => {
    const { t } = useTranslation()
    
    return <>
        <div className="preview-selection">
            <h4>{t('containers.update.viewSelection')} </h4>
            <Accordion>
                { acceptedFiles.map((file, index) => (
                <Accordion.Item eventKey={index}>
                    <Accordion.Header>{file.name}</Accordion.Header>
                    <Accordion.Body>
                        <Image src={pictures[index]} 
                                rounded
                                className='viewCard' 
                                onClick={() => setPicture(pictures[index]) } />
                        <Button onClick={() => {
                            acceptedFiles.slice(index, 1)
                            console.log("now we have acceptedFiles:", acceptedFiles)
                            setPictures(acceptedFiles)
                        } }>Delete</Button>
                    </Accordion.Body>
                </Accordion.Item>
                ) )}
            </Accordion>
        </div>
    </>
}

export { ImageViewer }