import React, { PureComponent } from "react";

class ProviderStats extends PureComponent {
    constructor(props) {
        super(props);
        this.getRows = this.getRows.bind(this);
    }

    getRows = () => {
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
        return demoProviders.map((client) => {
            return (
                <tr key={client.id}>
                    <td style={{height: 50, verticalAlign: 'middle', fontSize: 18}}>
                        {client.name}
                    </td>
                    <td style={{height: 50, verticalAlign: 'middle', fontSize: 18}}>
                        {client.address}
                    </td>
                    <td style={{height: 50, verticalAlign: 'middle', fontSize: 18}}>
                        {client.uptime}
                    </td>
                    <td style={{height: 50, verticalAlign: 'middle', fontSize: 18}}>
                        {client.location}
                    </td>
                    <td style={{height: 50, verticalAlign: 'middle', fontSize: 18}}>
                        {client.currentStorage}
                    </td>
                </tr>
            );
        });
    };

    render() {
        return (
            <div style={{ width: "80%", marginLeft: '10%', marginRight: '10%' }}>
                <div style={{display: 'flex', justifyContent: 'center', fontSize: 40, fontWeight: 600, marginBottom: 50}}>
                    Registered Pinning Services
                </div>
                <table className={'bp3-html-table bp3-html-table-striped bp3-html-table-bordered'} width="100%">
                    <thead>
                    <tr>
                        <th style={{color: '#006F42', fontSize: 18}}>Name</th>
                        <th style={{color: '#006F42', fontSize: 18}}>ETH Address</th>
                        <th style={{color: '#006F42', fontSize: 18}}>Uptime</th>
                        <th style={{color: '#006F42', fontSize: 18}}>Location</th>
                        <th style={{color: '#006F42', fontSize: 18}}>Currently Stored</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ProviderStats;
