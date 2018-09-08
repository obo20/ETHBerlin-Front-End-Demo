import React, { Component } from 'react';
import './App.css';
import { PinataBlue, PinataPink, PinataYellow } from "./theme";
import ReactSVG from "react-svg";
import PinataSVG from "./images/pinataSVG.svg";
import PinataReverseSVG from "./images/PinataReverseSVG.svg";
import Navigation from './components/navigation'
import { Button, Icon, Menu, MenuItem, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";

import { NavigationContext, NavigationProvider } from './contexts';
import ProviderStats from "./pages/ProviderStats";
import HomePage from "./pages/homePage";

class App extends Component {

    getCurrentPage(pageName) {
        switch (pageName) {
            case 'Home':
                return <HomePage/>;
            case 'ProviderStats':
                return <ProviderStats/>;
            default:
                return <ProviderStats/>;
        }
    }
    render() {
        return (
            <div style={{padding: 20}}>
                <NavigationProvider>
                    <Navigation/>
                    <NavigationContext.Consumer>
                        {({pageName}) =>
                            <div>
                                {this.getCurrentPage(pageName)}
                            </div>
                        }
                    </NavigationContext.Consumer>
                </NavigationProvider>
        </div>
    );
  }
}

export default App;
