<template>
  <div class="w-100 h-100vh flex flex-col items-center justify-center gap-5 mt-32">
    <header class="w-full p-4 bg-gray-800 flex justify-end items-center gap-10">
      <span v-if="account" class="text-white">💵250pts</span>
      <button @click="connectWallet" class="py-2 px-4 rounded-lg text-white text-sm bg-green-600 hover:bg-green-800">
        <span v-if="!account">Connect Wallet</span>
        <span v-else class="flex justify-center items-center gap-2">
          <Icon name="ion:wallet" size="20" class="text-center" />
          {{ shortenAddress(account) }}
        </span>
      </button>
    </header>

    <main class="flex flex-col items-center justify-center mt-20 gap-5">
      <h2 class="font-bold text-2xl">zkPass Bounty 🎉</h2>
      <h2 class="font-bold text-2xl">💲Binance User and Trade Verification</h2>
      
      <button @click="checkAndVerify()" :disabled="loadingUser || loadingTrade" class="mt-10 py-5 px-20 rounded-lg text-black text-xl bg-green-500">
        <span v-if="loadingUser || loadingTrade" class="flex items-center gap-5">
          <span>Please wait</span>
          <LodingVertical />
        </span>
        <span v-else>Verify</span>
      </button>
      
      <section class="w-100 flex-col justify-start items-center gap-10">
        <div>
          <div v-if="loadingUser" class="flex items-center justify-between gap-5 mt-5">
            <span>Validating Binance User</span>
            <LoadingIcon />
          </div>
          <div v-else-if="userVerified" class="flex items-center justify-between gap-5 mt-5">
            <span>User is a valid Binance account!</span> 
            <span>✔️</span>
          </div>
          <div v-else-if="errorUser" class="flex items-center justify-between gap-5 mt-5">
            <span class="text-red-600">{{ errorUser }}</span> 
            <span>❌</span>
          </div>
        </div>

        <div>
          <div v-if="loadingTrade" class="flex items-center justify-between gap-5 mt-5">
            <span>Validating Trade Status</span>
            <LoadingIcon />
          </div>
          <div v-else-if="tradeVerified" class="flex items-center justify-between gap-5 mt-5">
            <span>User has made a trade!</span> 
            <span>✔️</span>
          </div>
          <div v-else-if="errorTrade" class="flex items-center justify-between gap-5 mt-5">
            <span class="text-red-600">{{ errorTrade }}</span> 
            <span>❌</span>
          </div>
        </div>
      </section>
      
      <div v-if="(userVerified && tradeVerified) && (!loadingUser && !loadingTrade)" class="mt-10 flex flex-col justify-start items-center">
       <p class="text-lg mb-2"><u> Hurray🎉🎉 You have some trade experience:</u></p>
        <p class="text-2xl">Visit <a class="text-red-600" href="https://testnet.iexchange.global/my-ads/create" target="_blank">iExchange Global</a> to be enrolled as a <b>Merchant!</b></p>
      </div>
      <div v-else-if="(errorUser || errorTrade) && (!loadingUser && !loadingTrade)" class="mt-10 flex flex-col justify-start items-center">
        <p class="text-lg mb-2"><u>😢😢 New to the crypto trade?</u></p>
        <p class="text-2xl">Visit <a class="text-red-600" href="https://testnet.iexchange.global/" target="_blank">iExchange Global</a> to be get started!</p>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
  import type { Result } from '@zkpass/transgate-js-sdk/lib/types';
  import TransgateConnect from '@zkpass/transgate-js-sdk';
  import Web3 from "web3"
  
  const account = ref<string | null>(null)
  
  const loadingUser = ref(false)
  const loadingTrade = ref(false)
  const userVerified = ref(false);
  const tradeVerified = ref(false);
  const errorUser = ref("");
  const errorTrade = ref("");
  
  const web3 = new Web3()
  const appid = "16cd409e-7f0f-4955-85f2-311af2bfd692"; //my app id
  const schemaIdUser = "6bbc0b33e8ea4e37955f19a708035f61"; // Binance use schema
  const schemaIdTrade = "4e1608232b3c47ba88ebbe0878d267ea"; // binance user trade schema
  
  // Wallet connection
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        account.value = accounts[0] // Set the first account as the active account
        console.log("Connected account:", account.value)
      } catch (error) {
        console.error("Error connecting to MetaMask:", error)
        alert("Error connecting to MetaMask. Please try again.")
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.")
    }
  }

  const checkAndVerify = async () => {
    if (!account.value) {
      const userConfirmed = confirm("🚨 OPTIONAL! - Please connect your wallet for 🤑zKPoints.");
      
      if (userConfirmed) {
        await connectWallet();
        verify();
      } else {
        verify();
      }
    }
  }

  const verify = async () => {
    loadingUser.value = true
    loadingTrade.value = true

    const connector = new TransgateConnect(appid)
    try {
      const isAvailable = await connector.isTransgateAvailable()
      if (!isAvailable) {
        alert("Install zkPass TransGate extension to continue.");
        return;
      }

      // Verify Binance User
      loadingUser.value = true;
      const userResponse = await connector.launch(schemaIdUser) as Object;
      console.log("User Response:", userResponse);
      userVerified.value = verifyResult({...userResponse, schemaId: schemaIdUser});
    } 
    catch (error) {
      console.error("User verification error:", error);
      errorUser.value = "User verification failed.";
      errorTrade.value = "Trade verification will definitely fail!";
      loadingTrade.value = false;
      return;
    } finally {
      loadingUser.value = false;
    }

    try {
      // Verify Trade Status
      loadingTrade.value = true;
      const tradeResponse = await connector.launch(schemaIdTrade) as Object;
      console.log("Trade Response:", tradeResponse);
      tradeVerified.value = verifyResult({...tradeResponse, schemaId: schemaIdTrade});
    } catch (error) {
      console.error("Trade verification error:", error);
      errorTrade.value = "Trade verification failed.";
    } finally {
      loadingTrade.value = false;
    }
  }
</script>

<style scoped>
  /* Styling for the header and positioning */
  header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;
  }

  main {
    padding-top: 100px; /* Adds space to account for the header */
  }
</style>