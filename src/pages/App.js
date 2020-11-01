import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { View } from './View';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/view" component={View}/>
          <Redirect to="/view"/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
