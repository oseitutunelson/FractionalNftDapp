import {axios} from 'axios';

const uploadToIPFS = async (metadata) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    try {
      const response = await axios.post(url, metadata, {
        headers: {
          pinata_api_key: '4a0e0d15e482e61e9279',
          pinata_secret_api_key: '3ced20157371fd8135da08d2e89c0bb19e8f3e1901c71e63622cde478f464caa',
        },
      });
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw new Error('IPFS upload failed');
    }
  };

export default uploadToIPFS;  