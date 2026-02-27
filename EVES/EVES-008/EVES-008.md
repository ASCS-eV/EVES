---
eves-identifier: 008
title: ENVITED-X On-Chain Identity & Revocation Management
author: Sid Lamichhane (@sid030sid); Siyovush Hamidov (@siyovush-hamidov); Baki Berkay Uzel (@bakiberkay); Felix Hoops (@flhps); Carlo van Driesten (@jdsika) 
discussions-to: https://github.com/ASCS-eV/EVES/issues/
status: Draft
type: Process
created: 2026-02-27
requires: ["EVES-001"]
replaces: None  
---

## Abstract

This specification defines the core decentralized identity (DID) architecture and operational lifecycle for the ENVITED-X ecosystem.
It introduces the application of the `did:ethr` method on the EVM-compatible Tezos Etherlink layer, describes an IPFS-backed approach for managing Credential Revocation Sets (CRSet), and details a Gas Station relay service to provide frictionless onboarding for ecosystem participants.

## Motivation

The ENVITED-X Data Space requires a robust, scalable, and verifiable on-chain identity architecture:

1. **DID Method Verification**: The legacy SimpulseID implementation lacked resolvable DID documents on Tezos deployments, hindering direct on-chain verification by smart contracts.
2. **Revocation Scalability**: Maintaining extensive Credential Revocation Sets (CRSet) purely via EVM smart contracts (or blob transactions) incurs unpredictable costs and storage constraints on Layer 2.
3. **Frictionless Onboarding**: Requiring Trust Anchors or new Companies to acquire crypto funds solely to interact with a base registry (e.g., delegating authority) creates a significant adoption bottleneck.

By standardizing these three pillars—DID Method, Revocation Mechanics, and Gasless Onboarding—this EVES ensures a cohesive, interoperable trust framework.

## Specification

### 1. Decentralized Identifier (DID) Method Selection

The ENVITED-X ecosystem mandates the use of the **`did:ethr`** method, conforming to the [ERC-1056 Smart Contract standard](https://eips.ethereum.org/EIPS/eip-1056).

- **Deployment Layer**: Contract instances MUST be deployed on EVM-compatible networks, specifically targeting the Tezos Etherlink L2.
- **Key Management**: The DID identifier remains permanent, while the `identityOwner` (controller) can be rotated independently of the address via `changeOwner`.
- **Delegation Separation**: Identifiers MUST differentiate between overarching Identity Owners and explicit Delegates (e.g., ephemeral hot wallets authorized strictly for signing Verifiable Credentials for a limited validity period).
- **Service Endpoints**: Ecosystem actors MUST utilize the native `setAttribute` functionality of the ERC-1056 registry to declare ecosystem services, fundamentally facilitating the CRSet mechanism.

### 2. IPFS-Based Credential Revocation Set (CRSet)

To avoid excessive on-chain storage while retaining decentralized verifiability, Credential Revocation Sets are maintained via IPFS.

#### Workflow Implementation

1. **Storing Revocations**: Utilizing the structure proposed in the CRSet protocol, the `Issuer` MUST generate a Bloom Filter Cascade (BFC) reflecting current revoked VCs and store it on IPFS.
2. **CID Declaration**: The calculated Content Identifier (CID) MUST be published as a service endpoint within the issuer's `did:ethr` document.
3. **Verification**: A `Verifier` (e.g., ENVITED-X backend or another smart contract system) MUST resolve the issuer's DID document, retrieve the active CID from the service entry, fetch the BFC from IPFS, and evaluate the credential's status entirely off-chain.

#### Actor Roles & Control

- **Trust Anchor**: Exercises top-level governance, typically via an M-of-N Multisig, controlling which overarching Entity/Company identities are trusted.
- **Company**: Holds the overarching organizational DID.
- **Admin**: Authorized entities (delegated by the Company or Trust Anchor) explicitly permitted to update the CRSet via the IPFS CID linkage in the registry.
- **User (Holder)**: Retains VCs, utilizing them specifically in `OID4VP` processes, passing the `credentialStatus` attribute during presentation.

### 3. Gas Station Relay Service for Onboarding

To establish frictionless adoption, the ENVITED-X backend implements a Gas Station relayer designed explicitly to handle Company/User onboarding operations without requiring the initializing party to hold native network tokens.

#### Relay Workflow

1. **Read State**: The Company frontend performs a gas-free `read` operation to fetch the current `nonce` of their identity from the deployed `EthereumDIDRegistry`.
2. **Signature Construct**: The frontend constructs an EIP-712 / `keccak256` hash representing the intended `changeOwner` / delegation operation and the user signs it locally (gas-free).
3. **Relay Execution**: The signed payload is transmitted (e.g., via `POST /api/onboard`) to the Backend Relayer.
4. **Validation and Payment**: The Backend Relayer splits the signature (`v, r, s`), verifies validity against the expected payload, pays the network computational gas, and invokes the `changeOwnerSigned()` function on the ERC-1056 logic contract.

*Note: While ERC-4337 (Account Abstraction) was evaluated, it was rejected due to lack of immediate, native compatibility with the canonical `did:ethr` registry without writing intermediary adapters.*

## Backwards Compatibility

This specification enforces the replacement of undocumented identity mechanics with strict adherence to `did:ethr` standards.
Current infrastructure attempting to query SimpulseID generic DIDs or expecting on-chain BFC arrays will require middleware adaptation to index the IPFS CIDs referenced within the DID documents.

## References

- [ERC-1056: Ethereum Lightweight Identity](https://eips.ethereum.org/EIPS/eip-1056)
- [did:ethr Method Specification](https://github.com/decentralized-identity/ethr-did-resolver)
- [OID4VCI & OID4VP Overview](https://openid.net/sg/openid4vc/)
- [IPFS Content Addressing](https://docs.ipfs.tech/concepts/content-addressing/)
