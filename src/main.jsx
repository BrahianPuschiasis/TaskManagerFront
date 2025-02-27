import { BrowserRouter } from 'react-router-dom';
import './index.css' //es el css principal
import App from './App.jsx'
import ReactDOM from 'react-dom/client';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
            <App />
  </BrowserRouter>
);
