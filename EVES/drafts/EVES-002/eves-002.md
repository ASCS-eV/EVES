---
eves-identifier: 002
title: ENVITED-X Data Space Architecture Overview
author: Carlo van Driesten (@jdsika)
discussions-to: https://github.com/ASCS-eV/EVES/issues/10
status: Draft
type: Standards
created: 2024-11-19
requires: ["EVES-001"]
replaces: None
---

## Abstract

This specification provides a high-level overview of the architecture of the ENVITED-X Data Space.
It describes the modular design, key components, and interactions required to enable secure, scalable, and interoperable data sharing for automotive ADAS validation using simulation.
The document serves as a foundation for developers and technical decision-makers, with detailed requirements delegated to future EVES.

## Motivation

The ENVITED-X Data Space is a crystallization point for integrating various open standards and technologies into a cohesive system. Its architecture enables:

- **Scalability**: Support for large-scale operations via Layer 2 solutions like optimistic rollups.
- **Interoperability**: Compliance with Gaia-X, W3C standards, Tezos TZIPs, and other frameworks.
- **Security**: Leveraging UUIDs, IPFS CIDs, SHACL validations, and verifiable credentials.

This modular architecture supports the long-term vision of creating a robust ecosystem for securely sharing simulation assets and credentials.

## Specification

### 1. Architectural Overview

The ENVITED-X Data Space is built on the following core modules:

#### 1.1 Verifiable Credentials (VCs)

- **Purpose**:
  - Establish trust by verifying user and organization identities.
  - Enable permission management (e.g., membership validation, terms of service acceptance).
- **Key Features**:
  - Credentials are issued via [DEMIM](https://staging.identity.ascs.digital) and stored in W3C-compliant wallets like [Altme](https://altme.io).
  - Future support for contract-based credentials (e.g., purchase or download permissions).
- **Standards**:
  - Gaia-X Trust Framework.
  - W3C Verifiable Credentials and DIDs.
  - OPENID4VC protocols.

#### 1.2 Credential Registry Contract

- **Purpose**:
  - Store and validate credential statuses on the Tezos Ghostnet blockchain.
  - Enable real-time credential checks during system interactions.
- **Functionality**:
  - Tracks the **uuid** of credentials to ensure privacy.
  - Manages credential statuses (e.g., active/inactive for revocation).
- **Use Cases**:
  - Credential validation during login.
  - Whitelisting users for minting and accessing assets.

#### 1.3 Marketplace Contract

- **Purpose**:
  - Serve as the backbone for registering assets as NFTs on Tezos Ghostnet.
  - Ensure compliance with the TZIP-21 metadata standard to use open source libraries of the greater Tezos ecosystem.
- **Key Features**:
  - Whitelisting through the registry contract's "view" entry point.
  - Minting NFTs representing simulation assets defined in [EVES-003](https://github.com/ASCS-eV/EVES/blob/main/drafts/EVES-003/EVES-003.md).
- **Standards**:
  - FA2.1 compliance for token creation and ticket-based interoperability.

#### 1.4 Indexer Module

- **Purpose**:
  - Monitor and index smart contract events using [Taquito](https://taquito.io/).
- **Key Features**:
  - Tracks minting events, credential status changes, and asset registrations.
  - Stores indexed data in a database for efficient querying.

#### 1.5 Asset Layer

- **Purpose**:
  - Represent assets as NFTs linked to IPFS metadata.
- **Key Features**:
  - Validation of metadata using SHACL shapes.
  - Secure identification via CIDs and UUIDs.

#### 1.6 Scalability Layer

- **Purpose**:
  - Enable high-throughput operations via Layer 2 solutions like [Etherlink](https://www.etherlink.com/).
- **Key Features**:
  - Trustless bridging using FA2.1 tickets.
  - Integration with existing optimistic rollup implementations.

### 2. Interaction Workflow

The interaction between modules can be summarized as follows:

1. **Credential Issuance**:
   - A user or organization requests a credential via DEMIM.
   - Credential metadata includes identity, permissions, and additional attributes.
   - Credential is stored in a wallet (e.g., Altme) and referenced by uuid in the registry contract.

2. **Login and Validation**:
   - User logs in to ENVITED-X.
   - The system validates the credential (e.g., membership status) via the registry contract.

3. **Asset Registration**:
   - User uploads simulation assets to ENVITED-X following the process in EVES-003.
   - Metadata is validated against SHACL shapes and stored in IPFS.
   - NFT is minted via the marketplace contract, with whitelisting enforced by the registry.

4. **Event Indexing**:
   - Taquito monitors minting events and updates the database for querying.

5. **Scaling with Layer 2**:
   - Tickets from the marketplace enable assets to bridge to Layer 2 for scalability.

## Modular Design Goals

The modular design ensures:

1. **Scalability**:
   - Integration with Layer 2 technologies like optimistic rollups.
2. **Interoperability**:
   - Alignment with Gaia-X, W3C, and Tezos standards.
3. **Security**:
   - Use of UUIDs, IPFS CIDs, and cryptographic verification.

Future EVES will provide detailed specifications for each module.

## Key Technologies and Standards

- **Gaia-X Trust Framework**: Ensures alignment with European data sovereignty and interoperability principles.
- **W3C Verifiable Credentials and DIDs**: Supports decentralized identity management.
- **Tezos Blockchain**: Hosts smart contracts for credential registry and asset marketplace.
- **IPFS**: Provides immutable storage for asset metadata.
- **TZIP-21**: Ensures NFT metadata interoperability.
- **FA2.1**: Supports ticket-based bridging to Layer 2.

## References

1. [DEMIM](https://staging.identity.ascs.digital)
2. [Altme Wallet](https://altme.io)
3. [Tezos FA2.1 Standard](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-21/tzip-21.md)
4. [Etherlink Bridge](https://www.etherlinkbridge.com/bridge)
5. [EVES-003: ENVITED Asset Definition and Upload Process](https://github.com/ASCS-eV/EVES/blob/main/drafts/EVES-003/EVES-003.md)
6. [Gaia-X Trust Framework](https://docs.gaia-x.eu/policy-rules-committee/compliance-document/24.11/)

## Implementation

An initial implementation is done for the [ENVITED-X Data Space](https://staging.envited-x.net)
