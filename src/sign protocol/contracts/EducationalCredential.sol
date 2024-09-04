// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ISP } from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";

contract EducationalCredential is Ownable {
    struct Credential {
        string ciphertext;
        string dataToEncryptHash;
    }

    ISP public spInstance;
    uint64 public constant CREDENTIAL_SCHEMA_ID = 1;

    mapping(address => Credential[]) private credentials;

    event CredentialIssued(address indexed institution, address indexed recipient, string ciphertext , string dataToEncryptHash );
    constructor(address spInstanceAddress) Ownable(_msgSender()) {
        require(spInstanceAddress != address(0), "Invalid SP instance address");
        spInstance = ISP(spInstanceAddress);
    }

    function setSPInstance(address instance) external onlyOwner {
        require(instance != address(0), "Invalid SP instance address");
        spInstance = ISP(instance);
    }

    function issueCredential(
        address recipient,
        string memory ciphertext,
        string memory dataToEncryptHash
    ) external  {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(ciphertext).length > 0, "ciphertext name cannot be empty");
        require(bytes(dataToEncryptHash).length > 0, "Hash name cannot be empty");

        // Validate with schemaHook
        bool isValid = schemaHook(CREDENTIAL_SCHEMA_ID, abi.encode(ciphertext, dataToEncryptHash), recipient);
        require(isValid, "Data validation failed");

        credentials[recipient].push(Credential(ciphertext, dataToEncryptHash));
        emit CredentialIssued(_msgSender(), recipient, ciphertext, dataToEncryptHash);
    }

    function getCredentials(address wallet) external view returns (string[] memory ciphertexts, string[] memory dataToEncryptHashs) {
        Credential[] memory userCredentials = credentials[wallet];
        uint256 credentialCount = userCredentials.length;

        ciphertexts = new string[](credentialCount);
        dataToEncryptHashs = new string[](credentialCount);

        for (uint256 i = 0; i < credentialCount; i++) {
            ciphertexts[i] = userCredentials[i].ciphertext;
            dataToEncryptHashs[i] = userCredentials[i].dataToEncryptHash;
        }

        return (ciphertexts, dataToEncryptHashs);
    }


    function schemaHook(
        uint64 schemaId,
        bytes memory data,
        address recipient
    ) internal pure returns (bool) {
        require(schemaId == CREDENTIAL_SCHEMA_ID, "Invalid schema ID");
        require(recipient != address(0), "Invalid recipient address");

        (string memory ciphertext, string memory dataToEncryptHash) = abi.decode(data, (string, string));

        require(bytes(ciphertext).length > 0, "ciphertext name cannot be empty");
        require(bytes(dataToEncryptHash).length > 0, "Hash cannot be empty");

        return true;
    }
}
