import React, { PureComponent } from "react";
import ReactSVG from "react-svg";
import PinataSVG from "./../images/pinataSVG.svg";
import PinataReverseSVG from "./../images/PinataReverseSVG.svg";
import EthereumSVG from "./../images/EthereumLogo.svg";
import InfuraLogo from "./../images/infura.png";
import AzureLogo from "./../images/azure.png";

import { Button, Card, Checkbox, Classes, Dialog, Elevation, Icon, Intent, TextArea } from "@blueprintjs/core";
import { pinJSONToIPFS } from "../apiCalls/pinToIPFS";
import SubmitSection from '../components/SubmitSection';

const demoProviders = [
    {
        id: 0,
        name: `Pinata Official`,
        address: '0x0000000000000000000000000000000000001337',
        uptime: '99.99%',
        location: 'Germany',
        costPerGB: '.02 ETH',
        currentStorage: '30.4TB'
    },
    {
        id: 1,
        name: `Infura`,
        address: '0x0000000000000000000000000000000000000000',
        uptime: '99.98%',
        location: 'Australia',
        costPerGB: '.02 ETH',
        currentStorage: '10.2GB'
    },
    {
        id: 2,
        name: 'EthPinners',
        address: '0x0000000000000000000000000000000000000000',
        uptime: '92.36%',
        location: 'Canada',
        costPerGB: '.01 ETH',
        currentStorage: '6.4TB'
    },
    {
        id: 3,
        name: 'Azure',
        address: '0x0000000000000000000000000000000000000000',
        uptime: '99.99%',
        location: 'USA',
        costPerGB: '.02 ETH',
        currentStorage: '20.4TB'
    }
];

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            eventsGatheredArray: [],
            eventSelectionArray: [],
            addABIDialogOpen: false,
            ABIInput: [],
            validABI: false,
            hash: null,
            providersSelected: -1,
        };

        this.getEventsToSelect = this.getEventsToSelect.bind(this);
        this.getEventsToSelectDiv = this.getEventsToSelectDiv.bind(this);
        this.handleEventInputSelection = this.handleEventInputSelection.bind(this);
        this.openABIDialog = this.openABIDialog.bind(this);
        this.closeABIDialog = this.closeABIDialog.bind(this);
        this.handleABIInputChange = this.handleABIInputChange.bind(this);
        this.handleABIInputSubmit = this.handleABIInputSubmit.bind(this);
        this.pinConfigToIPFS = this.pinConfigToIPFS.bind(this);
        this.getProviders = this.getProviders.bind(this);
        this.providerToggled = this.providerToggled.bind(this);
    }

    handleEventInputSelection(inputIndex) {
        const tempIndexArray = this.state.eventSelectionArray.slice();
        tempIndexArray[inputIndex] = !tempIndexArray[inputIndex];
        this.setState({
            eventSelectionArray: tempIndexArray
        });
    }

    openABIDialog() {
        this.setState({addABIDialogOpen: true});
    }

    closeABIDialog() {
        this.setState({addABIDialogOpen: false});
    }

    handleABIInputChange(event) {
        function IsJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        if(IsJsonString(event.target.value) === true) {
            this.setState({
                ABIInput: event.target.value,
                validABI: true
            });
        } else {
            this.setState({
                ABIInput: event.target.value,
                validABI: false
            });
        }
    }

    handleABIInputSubmit() {
        this.getEventsToSelect(this.state.ABIInput);
        this.closeABIDialog();
    }

    getConfig() {
        const selectedEvents = this.state.eventSelectionArray;
        const gatheredEvents = this.state.eventsGatheredArray;
        const configJSON = [];
        gatheredEvents.forEach((event) => {
            let numSelected = 0;
            const eventConfig = {
                name: event.name,
                params: []
            };
            event.inputs.forEach((input)=> {
                eventConfig.params.push({
                    "type": input.type,
                    "name": input.name,
                    "indexed": input.indexed,
                    "selected": selectedEvents[input.index] || false
                });

                if (selectedEvents[input.index]) {
                    numSelected++;
                }
            });

            if (numSelected > 0) {
                configJSON.push(eventConfig);
            }
        });
        return configJSON;
    }

    async pinConfigToIPFS() {
        const configJSON = this.getConfig();
        const response = await pinJSONToIPFS(configJSON);
        this.setState({ hash: response.data.IpfsHash });
    }

    getEventsToSelect(abi) {
        let parsedABI = JSON.parse(abi);
        if (parsedABI.abi) {
            parsedABI = parsedABI.abi;
        }
        if (!Array.isArray(parsedABI)) {
            throw new Error('Invalid ABI');
        }

        const eventsGathered = [];
        let index = 0;
        parsedABI.forEach((object) => {
            if(object.type === 'event') {
                const newInputs = object.inputs.map((input) => {
                    input.index = index;
                    index++;
                    return input;
                });
                eventsGathered.push({
                    name: object.name,
                    inputs: newInputs
                });
            }
        });

        this.setState({
           eventsGatheredArray: eventsGathered,
           eventSelectionArray: new Array(index).fill(false),
        });
    }

    getEventsToSelectDiv() {
        const events = [];
        this.state.eventsGatheredArray.forEach((event) => {
            const getInputs = (event) => {
                const inputs = [];
                event.inputs.forEach((input) => {
                    const inputDiv = (
                        <div key={input.index}>
                            <Checkbox checked={this.state.eventSelectionArray[input.index.selected]} label={`(${input.type}) ${input.name}`} onChange={() => this.handleEventInputSelection(input.index)} />
                        </div>
                    );
                    inputs.push(inputDiv);
                });
                return inputs;
            };
            const eventDiv = (
                <Card key={event.name} elevation={Elevation.THREE} style={{margin: 10}}>
                    <div style={{fontSize: 20, fontWeight: 600, marginBottom: 10}}>
                        {event.name}
                    </div>
                    {getInputs(event)}
                </Card>
            );
            events.push(eventDiv);
        });
        if(events.length === 0) {
            return '';
        }
        return (
            <div>
                <div style={{fontSize: 20, fontWeight: 600}}>
                    Select which event values have IPFS hashes:
                </div>
                <div>
                    {events}
                </div>
            </div>
        )
    }

    providerToggled(provider) {
        // const temp = this.state.providersSelected.slice();
        //temporary solution to mandate 1 provider, but will remove to expand to multiple providers per wizard walkthrough soon
        // temp[0] = false;
        // temp[1] = false;
        // temp[2] = false;
        // temp[3] = false;
        // temp[provider.id] = !this.state.providersSelected[provider.id];
        this.setState({
            providersSelected: provider.id
        });
    }

    getProviders() {
        let pinataColor = (this.state.providersSelected === 0) ? 'rgb(0, 255, 255, 0.5)' : 'white';
        const infuraColor = this.state.providersSelected === 1 ? 'rgb(0, 255, 255, 0.5)' : 'white';
        const ethPinnersColor = this.state.providersSelected === 2 ? 'rgb(0, 255, 255, 0.5)' : 'white';
        const azureColor = this.state.providersSelected === 3 ? 'rgb(0, 255, 255, 0.5)' : 'white';
        const imageHeight = '65px';
        return (
            <div style={{overflow: 'scroll'}}>
                <Card elevation={Elevation.THREE} interactive={true} style={{display: 'flex', alignItems: 'center', backgroundColor: pinataColor, margin: 10}} onClick={() => this.providerToggled(demoProviders[0])}>
                    <div style={{width: 100}}>
                        <ReactSVG src={PinataSVG} svgStyle={{height: imageHeight, width: imageHeight}}/>
                    </div>
                    <div style={{width: '100%'}}>
                        <div style={{fontSize: 20, fontWeight: 600}}>Pinata Official Pinning Service</div>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 10, fontWeight: 600}}>
                            <div style={{width: 75}}>
                                Germany
                            </div>
                            <div>
                                99.99% Uptime
                            </div>
                            <div>
                                .02 ETH / GB
                            </div>
                        </div>
                    </div>
                </Card>
                <Card elevation={Elevation.THREE} interactive={true} style={{display: 'flex', alignItems: 'center', backgroundColor: infuraColor, margin: 10}} onClick={() => this.providerToggled(demoProviders[1])}>
                    <div style={{width: 100}}>
                        <img src={InfuraLogo} width={imageHeight} height={imageHeight}/>
                    </div>
                    <div style={{width: '100%'}}>
                        <div style={{fontSize: 20, fontWeight: 600}}>Infura Pinning Service</div>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 10, fontWeight: 600}}>
                            <div style={{width: 75}}>
                                USA
                            </div>
                            <div>
                                99.98% Uptime
                            </div>
                            <div>
                                .02 ETH / GB
                            </div>
                        </div>
                    </div>
                </Card>
                <Card elevation={Elevation.THREE} interactive={true} style={{display: 'flex', alignItems: 'center', backgroundColor: ethPinnersColor, margin: 10}} onClick={() => this.providerToggled(demoProviders[2])}>
                    <div style={{width: 100}}>
                        <ReactSVG src={EthereumSVG} svgStyle={{height: imageHeight, width: imageHeight}}/>
                    </div>
                    <div style={{width: '100%'}}>
                        <div style={{fontSize: 20, fontWeight: 600}}>ETHPinners Pinning Service</div>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 10, fontWeight: 600}}>
                            <div style={{width: 75}}>
                                Canada
                            </div>
                            <div>
                                92.36% Uptime
                            </div>
                            <div>
                                .01 ETH / GB
                            </div>
                        </div>
                    </div>
                </Card>
                <Card elevation={Elevation.THREE} interactive={true} style={{display: 'flex', alignItems: 'center', backgroundColor: azureColor, margin: 10}} onClick={() => this.providerToggled(demoProviders[3])}>
                    <div style={{width: 100}}>
                        <img src={AzureLogo} width={imageHeight} height={imageHeight}/>
                    </div>
                    <div style={{width: '100%'}}>
                        <div style={{fontSize: 20, fontWeight: 600}}>Azure Official Pinning Service</div>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 10, fontWeight: 600}}>
                            <div style={{width: 75}}>
                                USA
                            </div>
                            <div>
                                99.99% Uptime
                            </div>
                            <div>
                                .02 ETH / GB
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    render() {
        return (
            <div>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div>
                        <ReactSVG src={PinataSVG} svgStyle={{height: '10em', width: '10em'}}/>
                    </div>
                    <div style={{fontSize: 60, fontWeight: 600}}>
                        Pinata Hub Demo
                    </div>
                    <div>
                        <ReactSVG src={PinataReverseSVG} svgStyle={{height: '10em', width: '10em'}}/>
                    </div>
                </div>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Card elevation={Elevation.THREE} style={{width: 500, height: 600, marginTop: 20, overflow: 'scroll'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{fontSize: 30, fontWeight: 600}}>
                                UPLOAD YOUR ABI
                            </div>
                            <Button icon={'document'} intent={'Primary'} onClick={() => this.openABIDialog()}>
                                Upload
                            </Button>
                        </div>
                        <div style={{height: 3, width: '100%', marginTop: 20, marginBottom: 30, backgroundColor: 'black'}}/>
                        <div>
                            {this.getEventsToSelectDiv()}
                        </div>
                    </Card>
                    <Icon icon={"arrow-right"} iconSize={60}/>
                    <Card elevation={Elevation.THREE} style={{width: 500, height: 600, marginTop: 20, overflow: 'scroll'}}>
                        <div style={{fontSize: 30, fontWeight: 600}}>
                            SELECT YOUR HOSTS
                        </div>
                        <div style={{height: 3, width: '100%', marginTop: 20, marginBottom: 30, backgroundColor: 'black'}}/>
                        {this.getProviders()}
                    </Card>
                    <Icon icon={"arrow-right"} iconSize={60}/>

                    <Card elevation={Elevation.THREE} style={{width: 500, height: 600, marginTop: 20}}>
                        <SubmitSection
                            clientAddress={this.state.providersSelected >= 0 && demoProviders[this.state.providersSelected].address}
                            config={this.getConfig()}
                        />
                    </Card>
                </div>
                <Dialog
                    title="Enter in your ABI code"
                    isOpen={this.state.addABIDialogOpen}
                    onClose={this.closeABIDialog}
                    canOutsideClickClose={true}
                    canEscapeKeyClose={true}
                    isCloseButtonShown={true}
                    style={{width: 700, height: 500}}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <TextArea
                            large={true}
                            style={{width: '100%', height: 375}}
                            intent={Intent.PRIMARY}
                            onBlur={this.handleABIInputChange}
                            onChange={this.handleABIInputChange}
                            value={this.state.ABIInput}
                        />
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.closeABIDialog}>Cancel</Button>
                            <Button
                                intent={Intent.PRIMARY}
                                disabled={!this.state.validABI}
                                onClick={() => this.handleABIInputSubmit()}
                            >
                                Submit ABI Code
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>

        );
    }
}

export default HomePage;
