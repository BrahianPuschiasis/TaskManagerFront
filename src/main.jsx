import { BrowserRouter } from 'react-router-dom';
import './index.css' 
import App from './App.jsx'
import ReactDOM from 'react-dom/client';
// eslint-disable-next-line no-unused-vars
import i18n from './components/i18n.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
            <App />
  </BrowserRouter>
);
