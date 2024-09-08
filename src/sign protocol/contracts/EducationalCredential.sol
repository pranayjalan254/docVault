// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ISP } from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";

contract EducationalCredential is Ownable {
    struct Credential {
        string ciphertext;
        string dataToEncryptHash;
    }

    ISP public immutable spInstance;
    uint64 public constant CREDENTIAL_SCHEMA_ID = 1;

    mapping(address => Credential[]) private credentials;

    event CredentialIssued(address indexed institution, address indexed recipient, string ciphertext, string dataToEncryptHash);

    error InvalidAddress();
    error EmptyString();
    error ValidationFailed();

    constructor(address spInstanceAddress) Ownable(_msgSender()) {
        if (spInstanceAddress == address(0)) revert InvalidAddress();
        spInstance = ISP(spInstanceAddress);
    }

    function issueCredential(
        address recipient,
        string calldata ciphertext,
        string calldata dataToEncryptHash
    ) external {
        if (recipient == address(0)) revert InvalidAddress();
        if (bytes(ciphertext).length == 0) revert EmptyString();
        if (bytes(dataToEncryptHash).length == 0) revert EmptyString();

        if (!_schemaHook(ciphertext, dataToEncryptHash, recipient)) revert ValidationFailed();

        credentials[recipient].push(Credential(ciphertext, dataToEncryptHash));
        emit CredentialIssued(_msgSender(), recipient, ciphertext, dataToEncryptHash);
    }

    function getCredentials(address wallet) external view returns (string[] memory ciphertexts, string[] memory dataToEncryptHashes) {
        Credential[] storage userCredentials = credentials[wallet];
        uint256 credentialCount = userCredentials.length;

        ciphertexts = new string[](credentialCount);
        dataToEncryptHashes = new string[](credentialCount);

        for (uint256 i = 0; i < credentialCount; i++) {
            Credential storage cred = userCredentials[i];
            ciphertexts[i] = cred.ciphertext;
            dataToEncryptHashes[i] = cred.dataToEncryptHash;
        }
    }

    function _schemaHook(
        string memory ciphertext,
        string memory dataToEncryptHash,
        address recipient
    ) private pure returns (bool) {
        if (recipient == address(0)) revert InvalidAddress();
        if (bytes(ciphertext).length == 0) revert EmptyString();
        if (bytes(dataToEncryptHash).length == 0) revert EmptyString();

        return true;
    }
}
