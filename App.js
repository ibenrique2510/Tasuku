import React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { mapping, light as theme } from '@eva-design/eva';
import { Router, Scene } from 'react-native-router-flux';
import LoginScreen from './src/scenes/Login';
import HomeScreen from './src/scenes/Home';

const App = () => (
  <React.Fragment>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider mapping={mapping} theme={theme}>
      <Router>
        <Scene key="root">
          <Scene key="login" hideNavBar={true} component={LoginScreen} panHandlers={null} initial/>
          <Scene key="home" hideNavBar={true} component={HomeScreen} panHandlers={null} />
        </Scene>
      </Router>
    </ApplicationProvider>
  </React.Fragment>
);

export default App;