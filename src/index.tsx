import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Evergreen from './components/app/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Evergreen />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
