import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import Main from './components/Main'
import Registration from './components/Registration';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Spoilers from './components/Spoilers';

function App() {
  return (
    <Router>
      <Switch>
        <div className="App">
          <NavBar path='' />
          <Route path='/home' exact component={Main} />
          <Route path='/registration' exact component={Registration} />
          <Route path='/spoilers' exact component={Spoilers} />
        </div>
      </Switch>
    </Router>
  );
}

export default App;
