import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import openseaLogo from './assets/Opensea.svg';
import gallery from './assets/gallery.gif';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import outliersNFT from './utils/OutliersNFT.json';
import outliersLogo from './assets/LOGO.png';
import './styles/fonts/TupacMagrath.woff';

// const assets = {
//   background: ["/assets/BACKGROUND/background-blue.png","/assets/BACKGROUND/background-bricks.png","/assets/BACKGROUND/background-clouds.png","/assets/BACKGROUND/background-cyan.png","/assets/BACKGROUND/background-fgdarkblue.png","/assets/BACKGROUND/background-green.png","/assets/BACKGROUND/background-lines.png","/assets/BACKGROUND/background-orange.png","/assets/BACKGROUND/background-pink.png","/assets/BACKGROUND/background-pink2.png","/assets/BACKGROUND/background-purple2.png","/assets/BACKGROUND/background-red2.png","/assets/BACKGROUND/background-sun.png","/assets/BACKGROUND/background-themed.png","/assets/BACKGROUND/background-yellow.png","/assets/BACKGROUND/pixil-layer-17.png"],
//   body: [
//     "/assets/BODY/body-blue.png","/assets/BODY/body-cyan.png","/assets/BODY/body-green.png","/assets/BODY/body-orange.png","/assets/BODY/body-pink.png","/assets/BODY/body-pink2.png","/assets/BODY/body-purple.png","/assets/BODY/body-red.png","/assets/BODY/body-yellow.png"
//   ],
//   elements: [
//     "/assets/ELEMENTS/elements-cup.png","/assets/ELEMENTS/elements-firetail.png","/assets/ELEMENTS/elements-flower.png","/assets/ELEMENTS/elements-planet.png"
//   ],
//   eyes: ["/assets/EYES/eyes-1.png","/assets/EYES/eyes-2.png","/assets/EYES/eyes-3.png","/assets/EYES/eyes-glasses1.png","/assets/EYES/eyes-glasses2.png","/assets/EYES/eyes-glasses3.png","/assets/EYES/eyes-glasses4.png","/assets/EYES/eyes-glasses5.png","/assets/EYES/eyes-glasses6.png","/assets/EYES/eyes-glasses7.png","/assets/EYES/eyes-tear.png"],
//   hats: ["/assets/HATS/elements-bluehat.png","/assets/HATS/elements-crown.png","/assets/HATS/elements-flower1.png","/assets/HATS/elements-greenhat.png","/assets/HATS/elements-halo.png","/assets/HATS/elements-horn.png"],
//   roar: ["/assets/ROAR/roar-blue.png","/assets/ROAR/roar-blue2.png","/assets/ROAR/roar-blue3.png","/assets/ROAR/roar-drool.png","/assets/ROAR/roar-fire.png","/assets/ROAR/roar-flowers.png","/assets/ROAR/roar-green.png","/assets/ROAR/roar-mask.png","/assets/ROAR/roar-pink.png","/assets/ROAR/roar-purple.png","/assets/ROAR/roar-rainbow.png","/assets/ROAR/roar-tongue.png","/assets/ROAR/roar-tongue2.png","/assets/ROAR/roar-yellow.png"],
//   spikes: ["/assets/SPIKES/spikes.png"],
// }

// Constants
const TWITTER_HANDLE = 'joycebydsgn';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /* state variable we use to store our user's public wallet after importing useState*/
  const [currentAccount, setCurrentAccount] = useState("");
  const [statusUpdate, setstatusUpdate]= useState("");


  // const [currentIndices, setCurrentIndices] = useState ({
  //   backgroundIndex: 5,
  //   bodyIndex: 1,
  //   elementIndex: 0,
  //   eyesIndex:2,
  //   hatsIndex:3,
  //   roarIndex:0,
  //   spikesIndex: 0,
  // })
  
  /*making sure this is async*/

  const checkIfWalletIsConnected = async () => {
    /*making sure we have access to window.ethereum */
    const {ethereum}=window;
  
    if (!ethereum) {
      console.log("Make sure you have metamask!!");
      return;
    } else{
      console.log("We have the ethereum object", ethereum);
    }

      /*
      * Check if we're authorized to access the user's wallet
      */
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    /*
      * User can have multiple authorized accounts, we grab the first one if its there!
      */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setstatusUpdate(`found an authorized Metamask account, go ahead & mint!`);

      setCurrentAccount(account);
      } else {
        console.log("no authorized account found.");
        setstatusUpdate("no authorized account found.");
      }
    }
  

  /*implementing connectWallet method */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if(!ethereum){
        setstatusUpdate("get a MetaMask wallet pls");
        return;
      }else{
        setstatusUpdate("found MetaMask wallet. connecting ..");
      }

      /*method to request access to account */
      const accounts = await ethereum.request({method:"eth_requestAccounts"});

      /*prints out public address once we authorize metamask */
      setstatusUpdate("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error){
        setstatusUpdate('there was an error.\nyou may only mint one thunderlizard NFT and you must have the authorized minter role to mint.');
        // setstatusUpdate(error.toString())
        console.log(error())
    }
  }

  //call make nft function from our web app
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x237daA112094De019E1ED6209c7F4b9f37Df7EaB";
  
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        // ethers is a lbirary that helps our frontend talk to our contract
        //A "Provider" is what we use to actually talk to Ethereum nodes. 
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, outliersNFT.abi, signer);
        // this line creates the connection to our contract
        //contract's address -> abi file
        
        setstatusUpdate("going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.mint();

        // ask connected contract the same in etherscan, query has role can do that here, use that to check/disable the button, pop up message
        //disable button -> ethers connection to check whether to render the button
  
        setstatusUpdate("minting... please wait.")
        await nftTxn.wait();
        
        setstatusUpdate(`minted!\nsee transaction: https://etherscan.io/tx/${nftTxn.hash}`);

        {seeTransaction()}

      } else {
        setstatusUpdate("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setstatusUpdate('there was an error.\nyou may only mint one nft and you must have the authorized minter role to mint.');
      // setstatusUpdate(error.toString())
      console.log(error())
    }
  }

  /*runsfunction when the page loads */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

    // Render Methods


   //connect wallet button 
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      connect wallet
    </button>
  );

    // mint button
  const connectedMint = () => (
    <button onClick={askContractToMintNft} className="cta-button mint-button">
      mint nft
    </button>
  );

  const seeTransaction = () =>(
    <p className ="sub-text">
      you've successfuly mined your thunderlizard NFT!! 
    </p>
  )

  
  return (
    
    <div className="App">
  
    {/* {assets.background.map((imgPath, index) => {
      return (
        <img onClick={setCurrentIndices({...currentIndices, backgroundIndex: index})} src={imgPath}></img>
      )
    })} */}
{/*     
    <button onClick = {() => {setCurrentIndices({...currentIndices, backgroundIndex: backgroundIndex + 1})}  }> Change Background</button> */}


      <div className="container">

        <div className="glass-container">

          <div className="column1">

          {/* <div className='wrapper'>
    
            <img className='wrapper-background' src={assets.background[currentIndices.backgroundIndex]}></img>
            <img className='wrapper-body' src={assets.body[currentIndices.bodyIndex]}></img>
            <img className='wrapper-elements' src={assets.elements[currentIndices.elementIndex]}></img>
            <img className='wrapper-eyes' src={assets.eyes[currentIndices.eyesIndex]}></img>
            <img className='wrapper-hats'src={assets.hats[currentIndices.hatsIndex]}></img>
            <img className='wrapper-roar'src={assets.roar[currentIndices.roarIndex]}></img>
            <img className='wrapper-spikes' src={assets.spikes[currentIndices.spikesIndex]}></img>
          
          </div> */}

            <center><img alt="NFT Preview" className="card" src={gallery} /></center><p/>

            <div className="statusUpdate">

                &#9758; <b>updating status</b> <span id="news"> ..</span><br/>
                
                <text className="statusUpdateText">
                 {statusUpdate}
                </text>

            </div>
      
        </div>

          <span className="column2">
            
            <p className="header">ThunderLizard <p style={{fontSize:'3.5vw', lineHeight:'0vh'}}>NFT Collection</p></p>
              
              <div className="sub-text">
                <p><b>We connect, educate, and empower the top Web3 builders in the world.</b></p>
                Outliers is a 10-week, summer program to empower exceptional student builders in Crypto and Web3.
                Through curriculum and technical projects, Outliers equips students from across the country with the resources, knowledge, and community necessary 
                to build and scale a successful Web3 venture. 
              </div>

              {currentAccount === "" ? (renderNotConnectedContainer()) : (
                <button onClick={askContractToMintNft} className="cta-button mint-button">
                mint nft
                </button>

              )}
              <br/><br/>

              
              <div className="disclaimer">⚠️ The Thunderlizard NFT is reserved for Outliers only ⚠️ </div>

              <br></br>

              <a 
              href="https://opensea.io/collection/outliers-v3"
              target="_blank"
              rel="noreferrer">
              <img className="opensea-logo" alt="Opensea Logo" src={openseaLogo} />
              </a>



          </span>
        
        </div>


        <div className="footer-container">

        <a
          href="https://twitter.com/outlierdao"
          target="_blank"
          rel="noreferrer" 
          >
            <img alt="Outliers Logo" className="outliers-logo" src={outliersLogo} />
          </a> 

          <br></br>
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
         >{`built by @${TWITTER_HANDLE}`}</a>
         
         <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
         
         </div>
         
        </div>
        
      </div>
  );
};

export default App;
