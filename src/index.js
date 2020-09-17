import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

ReactDOM.render(<App />, document.getElementById('root'));
