import React from 'react';
import ReactSVG from 'react-svg'
import PinataSVG from './../images/pinataSVG.svg'
import { Icon, Menu, MenuItem, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { PinataBlue, PinataPurple, PinataYellow }from './../theme.js';
import { NavigationContext } from './../contexts';

class Navigation extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <NavigationContext.Consumer>
                {({pageName, setPage}) => (
                    <div style={{width: '100%', padding: 10}}>
                        <nav style={{width: '100%'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                        <div>
                                            <ReactSVG src={PinataSVG} svgStyle={{ height: 75, width: 75 }}/>
                                        </div>
                                        <div style={{fontSize: 20, fontWeight: 600}}>
                                            Pinata
                                        </div>
                                        <div style={{marginLeft: 5, fontSize: 20, fontWeight: 600, color: 'red'}}>
                                            ( DEMO )
                                        </div>
                                    </div>
                                </div>
                                <div style={{color: 'black'}}>
                                    {pageName}
                                </div>
                                <div  style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                    <div style={{cursor: 'pointer'}}>
                                        <button className="bp3-button bp3-minimal" onClick={() => setPage('Home')} style={{fontSize: 20, fontFamily: 'Abel', fontWeight: 600}}>Home</button>
                                    </div>
                                    <div style={{marginLeft: 5, cursor: 'pointer'}}>
                                        <button className="bp3-button bp3-minimal" onClick={() => setPage('ProviderStats')} style={{fontSize: 20, fontFamily: 'Abel', fontWeight: 600}}>Provider Stats</button>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                )}
            </NavigationContext.Consumer>
        )
    }
}

export default Navigation;

