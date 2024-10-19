<template>
    <div class="w-100 h-100vh flex flex-col items-center justify-center gap-5 mt-32">
      <h2 class="font-bold text-2xl">zKPass Bounty</h2>
      <h2 class="font-bold text-2xl">Binance User and Trade Verification</h2>
      <button @click="verify()" class="py-5 px-20 rounded-lg text-white text-xl bg-slate-500">
        <span v-if="loadingUser && loadingTrade">Loading</span>
        <span v-else>Verify</span>
      </button>

      <div> 
        <span>Valid Binance User Check... </span>
        <span v-if="loadingUser">🔃</span>
        <span v-else-if="!loadingUser && passed">✔</span>
      </div>
      <div> 
        <span>Verification of Trade History...</span>
        <span v-if="loadingTrade"> 🔃</span>
        <span v-else-if="!loadingTrade && passed">✔</span>
      </div>
      
      <div v-if="true" class="mt-10 flex flex-col justify-start items-center">
       <h1><u> You have some trade experience:</u></h1>
        <p class="text-2xl">Visit <a class="text-red-600" href="https://testnet.iexchange.global/" target="_blank">iExchange Global</a> to get started!</p>
      </div>
    </div>
</template>

<script setup lang="ts">
  import type { Result } from '@zkpass/transgate-js-sdk/lib/types';
  import TransgateConnect from '@zkpass/transgate-js-sdk';
  import Web3 from "web3"
  
  const web3 = new Web3()
  const loadingUser = ref(false)
  const loadingTrade = ref(false)
  const passed = ref(false)

  const verify = async () => {
    loadingUser.value = true
    loadingTrade.value = true
    try {
      // Appid
      const appid = "16cd409e-7f0f-4955-85f2-311af2bfd692"

      const connector = new TransgateConnect(appid)

      const isAvailable = await connector.isTransgateAvailable()

      if (isAvailable) {
        console.log(isAvailable)
        // The schema id of my project
        const schemaId = "04b2fe58a0f047bc98c3289d8d0f0bb1"

        const res = await connector.launch(schemaId) as Result
        console.log('res', res)
        loadingUser.value = false
    
        const { taskId, validatorAddress, allocatorSignature, uHash, publicFieldsHash, recipient, validatorSignature } = res //return by Transgate
        const taskIdHex = Web3.utils.stringToHex(taskId)
        const schemaIdHex = Web3.utils.stringToHex(schemaId)

        const encodeParams = web3.eth.abi.encodeParameters(
          ["bytes32", "bytes32", "address"],
          [taskIdHex, schemaIdHex, validatorAddress]
        )
        const paramsHash = Web3.utils.soliditySha3(encodeParams) as string
        const signedAllocatorAddress = web3.eth.accounts.recover(paramsHash, allocatorSignature)
        if(signedAllocatorAddress === "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d") {
          console.log('verified')

          const taskIdHex = Web3.utils.stringToHex(taskId)
          const schemaIdHex = Web3.utils.stringToHex(schemaId)

          const types = ["bytes32", "bytes32", "bytes32", "bytes32"]
          const values = [taskIdHex, schemaIdHex, uHash, publicFieldsHash]

          if (recipient) {
            types.push("address")
            values.push(recipient)
          }

          const encodeParams = web3.eth.abi.encodeParameters(types, values)

          const paramsHash = Web3.utils.soliditySha3(encodeParams) as string

          const signedValidatorAddress = web3.eth.accounts.recover(paramsHash, validatorSignature)

          if (signedValidatorAddress === validatorAddress) {
            console.log('verify validator address')
            loadingTrade.value = false
            passed.value = true
          } else {
            console.log('not verified address')
          }
        } else {
          console.log('not verified')
        }
      } else {
        console.log('Please install TransGate')
      }
    } 
    catch (error) {
      console.log('transgate error', error)
      loadingUser.value = false
      loadingTrade.value = false
      passed.value = false
    }
  }
</script>

<style scoped>
</style>