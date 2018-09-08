import React, { PureComponent } from "react";

class ProviderStats extends PureComponent {
    constructor(props) {
        super(props);
        this.getRows = this.getRows.bind(this);
    }

    getRows = () => {
        const rowList = [
            {
                id: 1,
                name: `Pinata Official`,
                address: 'temporary address',
                uptime: '99.99%',
                location: 'Germany',
                costPerGB: '.01 ETH',
                currentStorage: '582.3GB'
            },
            {
                id: 2,
                name: `Pins "R" Us`,
                address: 'temporary address',
                uptime: '99.98%',
                location: 'Australia',
                costPerGB: '.01 ETH',
                currentStorage: '51.4GB'
            },
            {
                id: 3,
                name: 'Pin World',
                address: 'temporary address 2',
                uptime: '92.36%',
                location: 'Canada',
                costPerGB: '.01 ETH',
                currentStorage: '25.4GB'
            }
        ];
        return rowList.map((client) => {
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
