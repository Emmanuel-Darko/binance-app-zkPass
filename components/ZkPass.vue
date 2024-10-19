<template>
  <div>
    <div class="w-100 h-100vh flex flex-col items-center justify-center gap-5 mt-32">
      <h2 class="font-bold text-2xl">zKPass Test</h2>

      <!-- Input field for wallet address -->
      <input v-model="walletAddress" placeholder="Enter your wallet address" class="px-4 py-2 border rounded-lg" />

      <button @click="verify()" class="py-5 px-20 rounded-lg text-white text-xl bg-slate-500">
        Test
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { Result } from '@zkpass/transgate-js-sdk/lib/types'
  import TransgateConnect from '@zkpass/transgate-js-sdk'
  import Web3 from "web3"

  const web3 = new Web3()
  const walletAddress = ref('')  // Collect user's wallet address

  const verify = async () => {
    try {
      const appid = "39a00e9e-7e6d-461e-9b9d-d520b355d1c0"
      const connector = new TransgateConnect(appid)

      const isAvailable = await connector.isTransgateAvailable()

      if (isAvailable) {
        console.log(isAvailable)
        const schemaId = "7a7b7fef411c43e6bf6011c8d317777b"

        // Launch verification with dynamic wallet address
        const res = await connector.launch(schemaId, walletAddress.value) as Result
        console.log('res', res)

        const { taskId, validatorAddress, allocatorSignature, uHash, publicFieldsHash, recipient, validatorSignature } = res
        const taskIdHex = Web3.utils.stringToHex(taskId)
        const schemaIdHex = Web3.utils.stringToHex(schemaId)

        const encodeParams = web3.eth.abi.encodeParameters(
          ["bytes32", "bytes32", "address"],
          [taskIdHex, schemaIdHex, validatorAddress]
        )
        const paramsHash = Web3.utils.soliditySha3(encodeParams) as string
        const signedAllocatorAddress = web3.eth.accounts.recover(paramsHash, allocatorSignature)

        if (signedAllocatorAddress === "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d") {
          console.log('verified')

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
          } else {
            console.log('not verified address')
          }
        } else {
          console.log('not verified')
        }
      } else {
        console.log('Please install TransGate')
      }
    } catch (error) {
      console.log('transgate error', error)
    }
  }
</script>