import React from "react"
import Adapter from 'enzyme-adapter-react-16'
import { shallow, mount, configure } from 'enzyme'
import fetchMock from 'jest-fetch-mock'
import { BrowserRouter } from 'react-router-dom'
import App from '../../frontend/App'
import Navigation from '../../frontend/Views/routes/Navigation.component'

configure({ adapter: new Adapter() })
fetchMock.enableMocks()


describe('render Frontend React App with Jest & Enzyme', () => {
  it('Should contain an "App" component', () => { // shallow just write tags, do not traverse it
    const wrapper = shallow(<div id="root"><BrowserRouter><App /></BrowserRouter></div>)
    expect(wrapper.find(App)).toHaveLength(1)
  })
  it('Should contain a Navigation component', () => { // mount develop Component
    fetch.once({title: "Fetch is Mocked", content: "Fake content"})
    const wrapper = mount(<div id="root"><BrowserRouter><App /></BrowserRouter></div>)
    expect(wrapper.find(Navigation)).toHaveLength(1)
  })
})

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('render Frontend React App with @testing-library/react & jest-dom', () => {
  it('Should have an ARIA role "navigation"', () => {
    const { getByRole } = render(<div id="root"><BrowserRouter><App /></BrowserRouter></div>)
    expect(getByRole("navigation")).not.toBe(undefined)
  })
})
