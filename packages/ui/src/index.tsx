import React from 'react';
import ReactDOM from 'react-dom';
import { initializeIcons } from '@uifabric/icons';
import './styles.css';
import App from './App';

initializeIcons();

ReactDOM.render(<App />, document.getElementById('root'));
