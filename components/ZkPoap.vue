<template>
  <div class="container">
    <h1>POAP Verification</h1>

    <!-- Input form for wallet address -->
    <form @submit.prevent="startVerification">
      <div class="input-group">
        <label for="wallet">Enter your Ethereum Wallet Address:</label>
        <input
          v-model="walletAddress"
          type="text"
          id="wallet"
          placeholder="0x..."
          required
        />
      </div>

      <button type="submit">Verify POAP</button>
    </form>

    <!-- Display verification result -->
    <div v-if="verificationResult">
      <h3>Verification Result</h3>
      <p>{{ verificationResult }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const walletAddress = ref(""); // Holds the input value of the Ethereum wallet address
const verificationResult = ref(null); // Holds the verification result

// Function to start the zkPass verification
const startVerification = async () => {
  if (!walletAddress.value) {
    alert("Please enter a valid Ethereum wallet address");
    return;
  }

  // Mock zkPass initiation (Replace this with actual zkPass logic)
  try {
    const response = await verifyPOAP(walletAddress.value); // You can replace this with zkPass logic
    verificationResult.value = response.message;
  } catch (error) {
    verificationResult.value = "Verification failed. Please try again.";
  }
};

// Mock function to simulate POAP verification
const verifyPOAP = async (walletAddress) => {
  // This is where zkPass verification would be called.
  // For now, it's a mock function to simulate successful verification.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (walletAddress === "0x1234567890abcdef") {
        resolve({ message: "Success: You have collected at least 1 POAP." });
      } else {
        reject(new Error("Invalid wallet address."));
      }
    }, 1000);
  });
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.input-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

h3 {
  margin-top: 20px;
}
</style>
