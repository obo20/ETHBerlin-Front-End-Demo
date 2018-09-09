import axios from 'axios';
import config from './../config.json';
import { AppToaster } from './../utils/Toaster';

export const pinJSONToIPFS = (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(
            url,
            JSONBody,
            {
                headers: {
                    'pinata_api_key': config.pinata_api_key,
                    'pinata_secret_api_key': config.pinata_secret_api_key
                }
            }
        ).then(function (response) {
            AppToaster.show({
                message: 'Successfully uploaded config to IPFS!',
                intent: 'success'
            });
            return response;
        })
        .catch(function (error) {
            console.log(error);
        });
};