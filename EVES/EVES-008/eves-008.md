---
eves-identifier: 008
title: ENVITED-X On-Chain Identity & Revocation Management
author: "`Sid Lamichhane` (@sid030sid); `Siyovush Hamidov` (@siyovush-hamidov); `Baki Berkay Uzel` (@bakiberkay); `Felix Hoops` (@flhps); `Carlo van Driesten` (@jdsika)"
discussions-to: https://github.com/ASCS-eV/EVES/issues/
status: Draft
type: Process
created: 2026-02-27
requires: ["EVES-001"]
replaces: None
---

## Abstract

This specification defines the core decentralized identity (DID) architecture and operational lifecycle for the ENVITED-X ecosystem.
It introduces the application of the `did:ethr` method on the EVM-compatible `Tezos` `Etherlink` layer, describes an IPFS-backed approach for managing Credential Revocation Sets (`CRSet`), and details a Gas Station relay service to provide frictionless setup for ecosystem participants.

## Motivation

The ENVITED-X Data Space requires a robust, scalable, and verifiable on-chain identity architecture:

1. **DID Method Verification**: The legacy `SimpulseID` implementation lacked resolvable DID documents on `Tezos` deployments, hindering direct on-chain verification by smart contracts.
2. **Revocation Scalability**: Maintaining extensive Credential Revocation Sets (`CRSet`) purely via EVM smart contracts (or blob transactions) incurs unpredictable costs and storage constraints on Layer 2.
3. **Frictionless Setup**: Requiring Trust Anchors or new Companies to obtain cryptocurrency funds solely to interact with a base registry (for example, delegating authority) creates a significant adoption bottleneck.

By standardizing these three pillars—DID Method, Revocation Mechanics, and Sponsored Setup—this document ensures a cohesive, interoperable trust framework.

## Specification

### 1. Decentralized Identifier (DID) Method Selection

The ENVITED-X ecosystem mandates the use of the **`did:ethr`** method, conforming to the [ERC-1056 Smart Contract standard](https://eips.ethereum.org/EIPS/eip-1056).

- **Deployment Layer**: Developers MUST deploy contract instances on EVM-compatible networks, specifically targeting the `Tezos` `Etherlink` L2.
- **Key Management**: The DID identifier remains permanent, while the controller can rotate the `identityOwner` independently of the address via `changeOwner`.
- **Delegation Separation**: Identifiers MUST differentiate between overarching Identity Owners and explicit Delegates (for example, ephemeral hot wallets holding explicit authorization strictly for signing Verifiable Credentials for a limited validity period).
- **Service Endpoints**: Ecosystem actors MUST use the native `setAttribute` feature of the ERC-1056 registry to declare ecosystem services, fundamentally facilitating the `CRSet` mechanism.

### 2. IPFS-Based Credential Revocation Set (`CRSet`)

To avoid excessive on-chain storage while retaining decentralized verifiability, the ecosystem maintains Credential Revocation Sets via IPFS.

#### Workflow Implementation

1. **Storing Revocations**: Using the structure proposed in the `CRSet` protocol, the `Issuer` MUST generate a Bloom Filter Cascade (BFC) reflecting current revoked Verifiable Credentials and store it on IPFS.
2. **CID Declaration**: The issuer MUST publish the calculated Content Identifier (`CID`) as a service endpoint within the `did:ethr` document.
3. **Verification**: A `Verifier` (for example, ENVITED-X backend or another smart contract system) MUST resolve the DID document of the issuer, retrieve the active `CID` from the service entry, fetch the BFC from IPFS, and assess the credential status entirely off-chain.

#### Actor Roles & Control

- **Trust Anchor**: Exercises top-level governance, typically via an M-of-N multi-signature wallet, controlling which overarching Entity/Company identities receive trust.
- **Company**: Holds the overarching organizational DID.
- **Admin**: Entities holding explicit permission (delegated by the Company or Trust Anchor) to update the `CRSet` via the IPFS `CID` linkage in the registry.
- **User (Holder)**: Retains Verifiable Credentials, using them specifically in `OID4VP` processes, passing the `credentialStatus` attribute during presentation.

### 3. Gas Station Relay Service for Setup

To establish frictionless adoption, the ENVITED-X backend implements a Gas Station relay service designed explicitly to handle Company/User setup operations without requiring the initializing party to hold native network tokens.

#### Relay Workflow

1. **Read State**: The Company frontend performs a read operation, requiring no transaction fees, to fetch the current `nonce` of their identity from the deployed `EthereumDIDRegistry`.
2. **Signature Construct**: The frontend constructs an EIP-712 / `keccak256` hash representing the intended `changeOwner` / delegation operation and the user signs it locally.
3. **Relay Execution**: The frontend transmits the signed payload (for example, via `POST /api/onboard`) to the Backend Relay Service.
4. **Validation and Payment**: The Backend Relay Service splits the signature (`v, r, s`), verifies validity against the expected payload, pays the network computational fee, and invokes the `changeOwnerSigned()` function on the ERC-1056 logic contract.

*Note: The team evaluated ERC-4337 (Account Abstraction) but rejected it due to lack of immediate, native compatibility with the canonical `did:ethr` registry without writing intermediary adapter software.*

## Backwards Compatibility

This specification enforces the replacement of undocumented identity mechanics with strict adherence to `did:ethr` standards.
Current infrastructure attempting to query `SimpulseID` generic identifiers or expecting on-chain BFC arrays demands adapter software to index the IPFS `CIDs` referenced within the DID documents.

## References

- [ERC-1056: Ethereum Lightweight Identity](https://eips.ethereum.org/EIPS/eip-1056)
- [did:ethr Method Specification](https://github.com/decentralized-identity/ethr-did-resolver)
- [OID4VCI & OID4VP Overview](https://openid.net/sg/openid4vc/)
- [IPFS Content Addressing](https://docs.ipfs.tech/concepts/content-addressing/)
