import Web3 from 'web3';

// Define the structure of the Res type
export interface Res {
  taskId: string;
  uHash: string;
  publicFieldsHash: string;
  recipient: string;
  validatorAddress: string;
  allocatorSignature: string;
  validatorSignature: string;
}

const web3 = new Web3();
const EVMTaskAllocator = "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d";

const verifyEvmBasedResult = async (res: Res, schemaId: string): Promise<boolean> => {
  try {
    const { taskId, uHash, publicFieldsHash, recipient, validatorAddress, allocatorSignature, validatorSignature } = res;

    // Step 1: Verify Allocator Signature
    const taskIdHex = Web3.utils.stringToHex(taskId);
    const schemaIdHex = Web3.utils.stringToHex(schemaId);
    const allocatorParams = web3.eth.abi.encodeParameters(
      ["bytes32", "bytes32", "address"],
      [taskIdHex, schemaIdHex, validatorAddress]
    );
    const allocatorParamsHash = Web3.utils.soliditySha3(allocatorParams) as string;

    const signedAllocatorAddress = web3.eth.accounts.recover(allocatorParamsHash, allocatorSignature);
    const isAllocatorValid = signedAllocatorAddress === EVMTaskAllocator;
    console.log(`Allocator Signature Valid: ${isAllocatorValid}`);

    // Step 2: Verify Validator Signature
    const types = ["bytes32", "bytes32", "bytes32", "bytes32"];
    const values = [taskIdHex, schemaIdHex, uHash, publicFieldsHash];

    if (recipient) {
      types.push("address");
      values.push(recipient);
    }

    const validatorParams = web3.eth.abi.encodeParameters(types, values);
    const validatorParamsHash = Web3.utils.soliditySha3(validatorParams) as string;

    const signedValidatorAddress = web3.eth.accounts.recover(validatorParamsHash, validatorSignature);
    const isValidatorValid = signedValidatorAddress === validatorAddress;
    console.log(`Validator Signature Valid: ${isValidatorValid}`);

    return isAllocatorValid && isValidatorValid;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
};

export default verifyEvmBasedResult;
