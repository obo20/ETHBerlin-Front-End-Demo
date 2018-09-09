import React from 'react';
import Web3 from 'web3';
import { Button } from "@blueprintjs/core";
import contract from 'truffle-contract';
import abi from '../abi/PinataHub.json';
import { pinJSONToIPFS } from "../apiCalls/pinToIPFS";


export default class SubmitSection extends React.Component {
  state = {
    hasWeb3: false,
    contractAddress: '',
    clientName: '',
    isAddress: false,
    isContract: false,
    loadedLogs: false,
    numLogs: 0,
    balance: '0',
    account: null,
  };

  web3 = null;
  PinataHub = null;

  async componentDidMount() {
    if (!window.web3) {
      return;
    }
    this.web3 = new Web3(window.web3.currentProvider);
    const _PinataHub = contract(abi);
    _PinataHub.setProvider(window.web3.currentProvider);
    this.PinataHub = await _PinataHub.deployed();

    const [account] = await this.web3.eth.getAccounts();

    this.setState({ hasWeb3: true, account });
    this.updateClientName();
    this.updateBalance();
  }

  componentDidUpdate(prevProps){
    if (this.props.clientAddress !== prevProps.clientAddress) {
      this.updateClientName();
      this.updateBalance();
    }
  }

  async updateClientName() {
    if (this.props.clientAddress) {
      const clientName = await this.PinataHub.getClientName(this.props.clientAddress);
      this.setState({ clientName });
    } else {
      this.setState({ clientName: '' });
    }
  }

  async pinConfigToIPFS() {
    const response = await pinJSONToIPFS(this.props.config);
    //this.setState({ hash: response.data.IpfsHash });
    return response.data.IpfsHash;
  }

  async updateBalance() {
    const balance = await this.PinataHub.getContractToClientBalance(this.state.contractAddress, this.props.clientAddress);
    this.setState({ balance: this.web3.utils.fromWei(balance.toString(), 'ether') });
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
        this.updateBalance();
      }
    }
  }

  getSignature(event) {
    return this.web3.utils.sha3(`${event.name}(${event.params.map(param => param.type).join(',')})`);
  }

  async loadPastHashes() {
    const signatures = this.props.config.map(event => this.getSignature(event));
    const logs = await this.web3.eth.getPastLogs({
      fromBlock: 1,
      address: this.state.contractAddress,
      topics: [signatures],
    });
    this.setState({
      loadedLogs: true,
      numLogs: logs.length,
    })
  }

  async register() {
    const hash = await this.pinConfigToIPFS();
    const receipt = await this.PinataHub.registerContractToClient(this.props.clientAddress, this.state.contractAddress, hash, { from: this.state.account });
    console.log(receipt);
  }

  render() {
    const { isAddress, isContract, clientName, loadedLogs, numLogs, balance } = this.state;

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
              disabled={!this.props.clientAddress}
            />
            {isAddress && isContract ? (
              <div>
                {loadedLogs ? `Found ${numLogs} files to pin` : 'Loading...'}
              </div>
            ): (
              <div>Please enter the address for an ethereum contract</div>
            )}
          </label>
        </div>

        <div>
          <Button disabled={!isAddress || !isContract} onClick={() => this.register()}>
            Register
            {clientName && clientName.length && ` with ${clientName}`}
          </Button>
        </div>

        {this.props.clientAddress && (
          <div>
            <div>Balance: {balance} ETH</div>
            <Button onClick={() => this.PinataHub.fundContractToClient(this.state.contractAddress, this.props.clientAddress, {
              from: this.state.account,
              to: this.props.clientAddress,
              value: this.web3.utils.toWei('0.2', 'ether'),
            }).then(() => this.updateBalance())}>
              Top off balance
            </Button>
          </div>
        )}
      </div>
    );
  }
}
