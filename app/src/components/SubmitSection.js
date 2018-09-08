import React from 'react';
import Web3 from 'web3';
import { Button } from "@blueprintjs/core";
import contract from 'truffle-contract';
import abi from '../abi/PinataHub.json';


export default class SubmitSection extends React.Component {
  // Proptypes:
  //  clientAddress: String
  //  hash: String
  //  config: Object

  state = {
    hasWeb3: false,
    contractAddress: '',
    clientName: '',
    isAddress: false,
    isContract: false,
    loadedLogs: false,
    numLogs: 0,
  };

  web3 = null;
  PinataHub = null;

  constructor() {
    super();
  }

  async componentDidMount() {
    if (!window.web3) {
      return;
    }
    this.web3 = new Web3(window.web3.currentProvider);
    const _PinataHub = contract(abi);
    _PinataHub.setProvider(window.web3.currentProvider);
    this.PinataHub = await _PinataHub.deployed();

    this.setState({ hasWeb3: true });
    this.updateClientName();
  }

  async updateClientName() {
    if (this.props.clientAddress) {
      const clientName = await this.PinataHub.getClientName(this.props.clientAddress);
      this.setState({ clientName });
    } else {
      this.setState({ clientName: '' });
    }
  }

  async changeAddress(address) {
    const isAddress = this.web3.utils.isAddress(address);
    this.setState({ contractAddress: address, isAddress });

    if (isAddress) {
      const code = await this.web3.eth.getCode(address);
      const isContract = code.length > 2
      this.setState({ isContract });

      if (isContract) {
        this.loadPastHashes();
      }
    }
  }

  getSignature(event) {
    return this.web3.utils.sha3(`${event.name}(${event.params.map(param => param.type).join(',')})`);
  }

  async loadPastHashes() {
    const signatures = this.props.config.map(event => this.getSignature(event));
    const logs = await this.web3.eth.getPastLogs({
      address: this.state.contractAddress,
      topics: [signatures],
    });
    this.setState({
      loadedLogs: true,
      numLogs: logs.length,
    })
  }

  async register() {
    const receipt = await this.PinataHub.registerContractToClient(this.props.clientAddress, this.state.contractAddress, this.props.hash);
    console.log(receipt);
  }

  render() {
    const { isAddress, isContract, clientName, loadedLogs, numLogs } = this.state;

    if (!this.state.hasWeb3) {
      return (
        <h4>Please install metamask</h4>
      );
    }

    return (
      <div>
        <div>
          <label>
            Contract Address {}
            <input
              value={this.state.contractAddress}
              onChange={e => this.changeAddress(e.target.value)}
              disabled={!this.props.hash}
            />
            {isAddress && isContract ? (
              <div>
                {loadedLogs ? `Found ${numLogs} files to pin` : 'Loading...'}
              </div>
            ): (
              <div>Please enter the address for an ethereum contract</div>
            )}
          </label>
          <div></div>
        </div>

        <div>
          <Button disabled={!isAddress || !isContract} onClick={() => this.register()}>
            Register
            {clientName && clientName.length && ` with ${clientName}`}
          </Button>
        </div>
      </div>
    );
  }
}
