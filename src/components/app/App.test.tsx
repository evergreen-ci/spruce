//import { shallow } from 'enzyme';
import { mount } from 'enzyme';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as rest from "../../rest/interface";
import { Login } from '../login/Login';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('clicking login button opens login modal', () => {
  const wrapper = mount(<Login client={rest.EvergreenClient('admin', 'e4f2c40463dcade5248d36434cb93bac', 'http://localhost:8080/api')}/>);
  // check that the modal exists, and that it is not currently open
  expect(wrapper.exists('#login-modal')).toBe(true);
  expect(wrapper.state('open')).toBe(false);
  // find the login button and click it
  const button = wrapper.find('#login-button').hostNodes();
  button.simulate('click');
  // check that the modal is now open
  expect(wrapper.state('open')).toBe(true);
});
