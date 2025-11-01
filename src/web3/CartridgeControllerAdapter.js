define(["dojo/_base/lang"], function(lang){
  var controller = null; 
  var account = null; 
  var constants = null;
  var Contract = null;
  
  // NFT Contract Configuration (Deploy your own contract and update this)
  var NFT_CONTRACT_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"; // Placeholder
  
  function ensure(){
    if(controller) return Promise.resolve();
    // Lazy-load ESM packages via unpkg to avoid bundling for now
    return Promise.all([
      import('https://unpkg.com/@cartridge/controller@latest/dist/index.mjs'),
      import('https://unpkg.com/starknet@latest/dist/index.mjs')
    ]).then(function(mods){
      var Controller = mods[0].default; 
      constants = mods[1].constants;
      Contract = mods[1].Contract;
      
      controller = new Controller({
        chains: [ { rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia' } ],
        defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
        policies: [
          {
            target: NFT_CONTRACT_ADDRESS,
            method: "mint_score_nft"
          }
        ]
      });
    });
  }
  
  return {
    connect: function(){
      return ensure().then(function(){ 
        return controller.connect(); 
      }).then(function(acct){ 
        account = acct; 
        console.log('Connected to Starknet:', acct.address);
        return acct; 
      });
    },
    
    isConnected: function(){ 
      return !!account; 
    },
    
    getAddress: function(){
      return account ? account.address : null;
    },
    
    disconnect: function(){
      account = null;
      controller = null;
    },
    
    mintScoreNFT: function(score){
      return ensure().then(function(){
        if(!account) throw new Error('Wallet not connected');
        
        console.log('Minting Spooky NFT for score:', score);
        
        // Call the mint_score_nft function on the contract
        // Parameters: recipient (address), score (u256), timestamp (u64)
        var timestamp = Math.floor(Date.now() / 1000);
        
        return account.execute([
          {
            contractAddress: NFT_CONTRACT_ADDRESS,
            entrypoint: 'mint_score_nft',
            calldata: [
              account.address, // recipient
              score, // score low
              0, // score high (u256)
              timestamp // timestamp
            ]
          }
        ]);
      }).then(function(result){
        console.log('NFT Minted! Transaction:', result.transaction_hash);
        return {
          success: true,
          txHash: result.transaction_hash,
          message: 'Spooky NFT minted successfully! 🎃'
        };
      }).catch(function(err){
        console.error('NFT Minting failed:', err);
        return {
          success: false,
          error: err.message
        };
      });
    },
    
    submitScore: function(score){
      // Submit score to leaderboard contract (if different from NFT contract)
      return ensure().then(function(){
        if(!account) throw new Error('Not connected');
        console.log('Submitting score to leaderboard:', score);
        // Implement leaderboard submission if needed
        return { txHash: '0x0' }; 
      });
    },
    
    fetchLeaderboard: function(){ 
      return Promise.resolve([]); 
    }
  };
});
