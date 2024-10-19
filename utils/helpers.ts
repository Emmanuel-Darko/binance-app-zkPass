import Web3 from "web3"
const web3 = new Web3()

// Shorten wallet address for UI display
export const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const verifyResult = (res: any) => {
    const {
      taskId,
      uHash,
      publicFieldsHash,
      validatorSignature,
      validatorAddress,
      schemaId
    } = res;
  
    if (
      !taskId ||
      !uHash ||
      !publicFieldsHash ||
      !validatorSignature ||
      !validatorAddress
    ) {
      console.error("Missing required fields:", {
        taskId,
        uHash,
        publicFieldsHash,
        validatorSignature,
        validatorAddress,
      });
      throw new Error("Required fields are missing from the response.");
    }
  
    const taskIdHex = Web3.utils.stringToHex(taskId);
    const schemaIdHex = Web3.utils.stringToHex(schemaId); // Assuming schemaIdUser is in context
    const paramsHash = web3.utils.soliditySha3(
      web3.eth.abi.encodeParameters(
        ["bytes32", "bytes32", "bytes32", "bytes32"],
        [taskIdHex, schemaIdHex, uHash, publicFieldsHash]
      )
    ) as any;
  
    const recoveredAddress = web3.eth.accounts.recover(
      paramsHash,
      validatorSignature
    );
  
    return recoveredAddress === validatorAddress;
};