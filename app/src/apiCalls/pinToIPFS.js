import axios from 'axios';
import config from './../config.json';

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
            return response;
        })
        .catch(function (error) {
            console.log(error);
        });
};