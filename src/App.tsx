import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import './App.css';
import ReposPage from './components/ReposPage'
import CommitsPage from './components/CommitsPage'

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/repos'>
                    <ReposPage/>
                </Route>
                <Route path='/commits'>
                    <CommitsPage/>
                </Route>
                <Route path='/'>
                    <ReposPage/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
