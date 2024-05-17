/* eslint-disable @next/next/no-img-element */
import Web3Modal from 'web3modal';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux';
import WalletConnectProvider from '@walletconnect/web3-provider';
import NextLink from 'next/link';
import { connect, disconnect } from '../reducers/wallet';
import styles from '../styles/header.module.css';

let web3Modal;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: { [process.env.NEXT_PUBLIC_CHAIN]: process.env.NEXT_PUBLIC_RPC_URL }, // required
      network: 'matic',
    },
  },
};

const Header = () => {
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet.value);

  const [address, setAddress] = useState();

  useEffect(() => {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions, // required
    });
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      provider.on('network', async (newNetwork, oldNetwork) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        dispatch(
          connect({ chainId: newNetwork.chainId, signer: provider.getSigner() })
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        const account = accounts[0];
        console.log('Found an authorized account ', account);
        setAddress(account);
        detailsOn();
      } else {
        await Disconnect();
        console.log('Could not find an authorized account');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Use Metamask!');
      } else {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log('Account connected ', accounts[0]);

        setAddress(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const detailsOn = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const addr = await signer.getAddress();

    setAddress(addr.toString());
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  async function Connect() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3ModalProvider = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);
        const { chainId } = await provider.getNetwork();
        dispatch(connect({ chainId, signer: provider.getSigner() }));
      } else {
        const web3ModalProvider = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);
        const { chainId } = await provider.getNetwork();
        dispatch(connect({ chainId, signer: provider.getSigner() }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function Disconnect() {
    dispatch(disconnect());
    await web3Modal.clearCachedProvider();
    localStorage.removeItem('walletconnect');
  }

  const setupNetwork = async () => {
    const provider = window.ethereum;
    if (provider) {
      const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN, 10);
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'Amoy',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: [
                'https://polygon-amoy-bor-rpc.publicnode.com',
                'https://polygon-amoy.blockpi.network/v1/rpc/public',
                'https://rpc-amoy.polygon.technology',
              ],
              blockExplorerUrls: ['https://www.oklink.com/amoy'],
            },
          ],
        });
        return true;
      } catch (error) {
        console.error('Failed to setup the network in Metamask:', error);
        return false;
      }
    } else {
      console.error(
        "Can't setup the BSC network on metamask because window.ethereum is undefined"
      );
      return false;
    }
  };

  function wrongNetwork() {
    if (!window.ethereum) {
      Disconnect();
      return;
    }
    setupNetwork();
  }
  return (
    <header className={styles.header}>
      <div style={{ display: 'flex' }}>
        <NextLink href="/">
          <div className={styles.logo}>
            <img src="/logo.webp" alt="logo" />
            <span className="hidden md:flex">Web3 Shopping Cart</span>
          </div>
        </NextLink>
      </div>
      <div style={{ flex: 'none' }}>
        {!wallet.connected && (
          <button className={styles.connectBtn} onClick={Connect}>
            Connect Wallet
          </button>
        )}
        {wallet.connected &&
          wallet.chainId.toString() === process.env.NEXT_PUBLIC_CHAIN && (
            <button
              className={styles.connectBtn}
              style={{ background: '#FF5525' }}
              onClick={Disconnect}
            >
              {address
                ? address.substring(0, 6) +
                  '...' +
                  address.substring(address.length - 4)
                : 'Disconnect'}
            </button>
          )}
        {wallet.connected &&
          wallet.chainId.toString() !== process.env.NEXT_PUBLIC_CHAIN && (
            <button
              className={styles.connectBtn}
              style={{ background: 'red' }}
              onClick={wrongNetwork}
            >
              Wrong Network
            </button>
          )}
      </div>
    </header>
  );
};

export default Header;
