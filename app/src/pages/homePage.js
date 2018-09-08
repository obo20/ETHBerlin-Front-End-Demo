import React, { PureComponent } from "react";
import ReactSVG from "react-svg";
import PinataSVG from "./../images/pinataSVG.svg";
import PinataReverseSVG from "./../images/PinataReverseSVG.svg";
import { Button, Card, Checkbox, Classes, Dialog, Elevation, Icon, Intent, TextArea } from "@blueprintjs/core";
import Web3 from 'web3';

const testAbi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_contract",
                "type": "address"
            },
            {
                "name": "_client",
                "type": "address"
            }
        ],
        "name": "fundContractToClient",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "withdrawContractToClientFunds",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_client",
                "type": "address"
            }
        ],
        "name": "getClientWatchedContractsArray",
        "outputs": [
            {
                "name": "",
                "type": "address[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_client",
                "type": "address"
            }
        ],
        "name": "getClientName",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_client",
                "type": "address"
            },
            {
                "name": "_contract",
                "type": "address"
            },
            {
                "name": "_configHash",
                "type": "string"
            }
        ],
        "name": "registerContractToClient",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_clientName",
                "type": "string"
            }
        ],
        "name": "registerAsClient",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_contractName",
                "type": "string"
            }
        ],
        "name": "registerAsContract",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_contract",
                "type": "address"
            },
            {
                "name": "_client",
                "type": "address"
            }
        ],
        "name": "getContractToClientBalance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "getContractName",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_contract",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_client",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "paymentAmount",
                "type": "uint256"
            }
        ],
        "name": "ClientContractFunded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_client",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "ClientRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_contract",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "ContractRegistered",
        "type": "event"
    }
];

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            eventsGatheredArray: [],
            eventSelectionArray: [],
            addABIDialogOpen: false,
            ABIInput: []
        };

        this.getEventsToSelect = this.getEventsToSelect.bind(this);
        this.getEventsToSelectDiv = this.getEventsToSelectDiv.bind(this);
        this.handleEventInputSelection = this.handleEventInputSelection.bind(this);
        this.openABIDialog = this.openABIDialog.bind(this);
        this.closeABIDialog = this.closeABIDialog.bind(this);
        this.handleABIInputChange = this.handleABIInputChange.bind(this);
        this.handleABIInputSubmit = this.handleABIInputSubmit.bind(this);
    }

    handleEventInputSelection() {

    }

    openABIDialog() {
        this.setState({addABIDialogOpen: true});
    }

    closeABIDialog() {
        this.setState({addABIDialogOpen: false});
    }

    handleABIInputChange(event) {
        this.setState({
            ABIInput: event.target.value
        });
    }

    handleABIInputSubmit() {
        this.getEventsToSelect();
        this.changeABIDialogState();
    }

    getEventsToSelect(abi) {
        const abiResponse = testAbi;
        const eventsGathered = [];
        let index = 0;
        abiResponse.forEach((object) => {
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
           eventsGatheredArray: eventsGathered
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
                            <Checkbox checked={this.state.eventSelectionArray[input.index.selected]} label={`(${input.type}) ${input.name}`} onChange={this.handleEventInputSelection(input.index)} />
                        </div>
                    );
                    // const inputDiv = '';
                    inputs.push(inputDiv);
                });
                return inputs;
            };
            const eventDiv = (
                <Card key={event.name} elevation={Elevation.THREE} style={{margin: 10}}>
                    <div style={{fontSize: 20, fontWeight: 600}}>
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
                    <Card elevation={Elevation.THREE} style={{width: 500, height: 600, marginTop: 20}}>
                        <div style={{fontSize: 30, fontWeight: 600}}>
                            UPLOAD YOUR ABI
                        </div>
                        <div style={{height: 3, width: '100%', marginTop: 20, marginBottom: 30, backgroundColor: 'black'}}/>
                        <div style={{fontSize: 20, fontWeight: 600}}>
                            EMAIL
                        </div>

                        <div style={{fontSize: 20, marginTop: 20, fontWeight: 600}}>
                            PINATA API KEY
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', fontSize: 20, marginTop: 20, fontWeight: 600}}>
                            <div>
                                PINATA SECRET API KEY
                            </div>
                        </div>
                    </Card>
                    <Icon icon={"arrow-right"} iconSize={60}/>
                    <Card elevation={Elevation.THREE} style={{width: 500, height: 600, marginTop: 20}}>
                        <div style={{fontSize: 30, fontWeight: 600}}>
                            UPLOAD YOUR ABI
                        </div>
                        <div style={{height: 3, width: '100%', marginTop: 20, marginBottom: 30, backgroundColor: 'black'}}/>
                        <div style={{fontSize: 20, fontWeight: 600}}>
                            EMAIL
                        </div>

                        <div style={{fontSize: 20, marginTop: 20, fontWeight: 600}}>
                            PINATA API KEY
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', fontSize: 20, marginTop: 20, fontWeight: 600}}>
                            <div>
                                PINATA SECRET API KEY
                            </div>
                        </div>
                    </Card>
                </div>
                <Dialog
                    title="Enter in your ABI code"
                    isOpen={this.state.addABIDialogOpen}
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
                            <Button
                                intent={Intent.PRIMARY}
                                onChange={() => this.handleABIInputSubmit()}
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
