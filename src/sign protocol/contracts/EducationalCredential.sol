// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ISP } from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";

contract EducationalCredential is Ownable {
    struct Credential {
        string course;
        uint256 issueDate;
    }

    ISP public spInstance;
    uint64 public constant CREDENTIAL_SCHEMA_ID = 1; // Set your schema ID here

    mapping(address => Credential[]) private credentials;

    event CredentialIssued(address indexed institution, address indexed recipient, string course, uint256 issueDate);

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
        string memory course,
        uint256 issueDate
    ) external onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(course).length > 0, "Course name cannot be empty");
        require(issueDate <= block.timestamp, "Issue date cannot be in the future");

        // Validate with schemaHook
        bool isValid = schemaHook(CREDENTIAL_SCHEMA_ID, abi.encode(course, issueDate), recipient);
        require(isValid, "Data validation failed");

        credentials[recipient].push(Credential(course, issueDate));
        emit CredentialIssued(_msgSender(), recipient, course, issueDate);
    }

    function getCredentials(address wallet) external view returns (string[] memory courses, uint256[] memory issueDates) {
        Credential[] memory userCredentials = credentials[wallet];
        uint256 credentialCount = userCredentials.length;

        courses = new string[](credentialCount);
        issueDates = new uint256[](credentialCount);

        for (uint256 i = 0; i < credentialCount; i++) {
            courses[i] = userCredentials[i].course;
            issueDates[i] = userCredentials[i].issueDate;
        }

        return (courses, issueDates);
    }

    function getLatestCredential(address wallet) external view returns (bool found, string memory course, uint256 issueDate) {
        Credential[] memory userCredentials = credentials[wallet];
        
        if (userCredentials.length == 0) {
            return (false, "", 0);
        }

        Credential memory latestCredential = userCredentials[userCredentials.length - 1];
        return (true, latestCredential.course, latestCredential.issueDate);
    }

    function schemaHook(
        uint64 schemaId,
        bytes memory data,
        address recipient
    ) internal view returns (bool) {
        require(schemaId == CREDENTIAL_SCHEMA_ID, "Invalid schema ID");
        require(recipient != address(0), "Invalid recipient address");

        (string memory course, uint256 issueDate) = abi.decode(data, (string, uint256));

        require(bytes(course).length > 0, "Course name cannot be empty");
        require(issueDate <= block.timestamp, "Issue date cannot be in the future");

        return true;
    }
}
