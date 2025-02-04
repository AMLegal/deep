import { GraphQLClient } from 'graphql-request';

import { getNftById } from './queries/polkadot';

const POLKADOT_NFT_API = 'https://squid.subsquid.io/speck/graphql';
const KUSAMA_NFT_API = 'https://squid.subsquid.io/stick/graphql';

const polkadotClient = new GraphQLClient(POLKADOT_NFT_API, { fetch });
const kusamaClient = new GraphQLClient(KUSAMA_NFT_API, { fetch });

export function getPolkadotNft(id: string) {
  return polkadotClient.request(getNftById, {
    id,
  });
}

export function getKusamaNft(id: string) {
  return kusamaClient.request(getNftById, {
    id,
  });
}

export async function getOpenSeaTestNetNft(
  contractAddress: string,
  tokenId: number
) {
  const nftRes = await fetch(
    `https://testnets-api.opensea.io/api/v2/chain/sepolia/contract/${contractAddress}/nfts/${tokenId}`
  );

  //TODO: Proper typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nftData: any = await nftRes.json();

  const collectionRes = await fetch(
    `https://testnets-api.opensea.io/api/v2/chain/sepolia/contract/${contractAddress}`
  );

  //TODO: Proper typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collectionData: any = await collectionRes.json();

  nftData.collection = collectionData;

  return await nftData;
}

export function getNftData(
  network: string,
  contractAddress: string,
  tokenId: number
) {
  switch (network) {
    case 'polkadot':
      return getPolkadotNft(`${contractAddress}-${tokenId}`);
    case 'kusama':
      return getKusamaNft(`${contractAddress}-${tokenId}`);
    case 'sepolia':
      return getOpenSeaTestNetNft(contractAddress, tokenId);
  }
}
