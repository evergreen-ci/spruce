import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Evergreen from './components/app/App';
import registerServiceWorker from './registerServiceWorker';
import './styles.css';

ReactDOM.render(
  <Evergreen />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
