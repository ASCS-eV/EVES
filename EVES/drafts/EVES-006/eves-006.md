---
eves-identifier: 006
title: ENVITED-X Scaling Architecture
author: Carlo van Driesten (@jdsika)
discussions-to: https://github.com/ASCS-eV/smart-contracts/blob/main/etherlink-bridge/README.md
status: Draft
type: Process
created: 2025-02-21
requires: ["EVES-001", "EVES-002", "EVES-003"]
replaces: None
---

## Abstract

This specification defines the scaling architecture for the ENVITED-X Data Space.
It outlines the integration of enshrined optimistic rollups with the Etherlink Layer 2 network, leveraging the Tezos ecosystem for scalable, secure, and cost-efficient transactions.
This document details the bridging mechanism between Tezos Layer 1 and Etherlink, describing the role of FA2.1 tickets, smart rollups, and optimistic fraud proofs in ensuring trustless scalability.

## Motivation

As the ENVITED-X Data Space grows, scalability becomes a critical requirement.
The limitations of Tezos Layer 1, particularly transaction throughput and gas fees, necessitate a Layer 2 solution.
Etherlink, an enshrined optimistic rollup, provides the following benefits:

- **Low-Cost Transactions**: Reduced fees (nearly free) compared to Layer 1 Tezos.
- **High Throughput**: Enables parallel execution and improved finality times.
- **Ethereum Compatibility**: Supports EVM tooling, enhancing interoperability.
- **Trustless Bridging**: Tezos tickets and rollup smart contracts ensure asset security without the need for multi-signature contracts.
- **On-Chain Security**: The rollup is secured by Tezos Layer 1, inheriting its consensus guarantees.

## Specification

### 1. Scaling with Etherlink

Etherlink is an enshrined optimistic rollup within the Tezos ecosystem that enables scalable execution of smart contracts. Unlike external rollups, enshrined rollups benefit from direct protocol support, reducing costs and increasing security.

- **Batching Transactions**: Multiple operations are aggregated and submitted as a single transaction to Tezos Layer 1.
- **Fraud Proofs**: Optimistic execution ensures validity unless proven otherwise.
- **EVM Compatibility**: Smart contracts can be deployed using Solidity, facilitating Ethereum ecosystem integration.

### 2. Bridging Mechanism

#### 2.1 FA2 Token Bridge

ENVITED-X assets are tokenized using the FA2.1 standard on Tezos.
The current bridge implementation allows for transfer of FA2 tokens as well which do not offer direct ticket export functionality.
Bridging these tokens to Etherlink involves:

1. **Depositing Tokens**: Users send FA2 (FA2.1) tokens to a bridge contract on Tezos Layer 1.
2. **Minting Tickets**: The bridge contract issues tickets representing the deposited tokens.
3. **Submitting to Rollup**: The tickets are forwarded to Etherlink via the rollup inbox.
4. **Minting on Layer 2**: Equivalent tokens are created on Etherlink and assigned to the user's wallet.

#### 2.2 Withdrawing Tokens

1. **Initiating Withdrawal**: The user submits a withdrawal request on Etherlink.
2. **Optimistic Challenge Period**: The transaction remains open for dispute (fraud-proof verification).
3. **Finalizing on Tezos**: If no fraud is detected, the Tezos contract releases the original tokens.

With the Rio upgrade, the withdrawal process from L2 to L1 will be significantly faster, improving efficiency for asset transitions.

### 3. Integration with ENVITED-X

#### 3.1 Asset Marketplace

- **Asset Registration**: Assets are initially registered on Tezos Layer 1 as FA2.1 tokens.
- **Cross-Layer Trading**: Once bridged, assets can be transferred or traded within the Etherlink ecosystem.
- **Metadata Preservation**: TZIP-21 metadata remains intact across layers.
- **Future Transition**: At a later stage, all L1 tokens can be transitioned to L2 to maximize scalability, allowing existing contracts to function until scaling is necessary.

#### 3.2 Smart Contracts & Indexing

- **Marketplace Contracts**: Implemented on both Tezos and Etherlink.
- **Indexer Support**: Taquito and Etherlink-compatible indexers track asset movements.
- **Credential Validation**: User credentials remain valid across both layers via Verifiable Credentials.

## Future Improvements

### 1. Transition to ERC-721 Tokens

Currently, the bridge implementation for Etherlink Layer 2 uses ERC-20 tokens. Future implementations should adopt ERC-721 token contracts for better asset representation and compatibility with NFT standards. [ERC-721 Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/)

### 2. Improvements with the Tezos Rio Protocol

The upcoming Tezos protocol "Rio" will introduce enhancements in bridging mechanisms and significantly reduce the bridging time from L2 to L1. More details can be found in the [Rio Protocol Announcement](https://research-development.nomadic-labs.com/rio-announcement.html) and [Rio Protocol Changelog](https://octez.tezos.com/docs/protocols/022_rio.html).

### 3. Full Transition to Layer 2

At some point, all L1 tokens should be bridged to L2, allowing the system to fully transition to Layer 2 scaling while maintaining compatibility with existing contracts during the migration phase. The layer 1 contracts will then be read-only to not allow further token minting on layer 1.

### 4. FA2.1 Ticket Export Functionality

The FA2.1 contract contains a ticket export functionality that can be used to directly issue tickets. This can improve efficiency and user experience for cross-layer asset transfers.

## Backwards Compatibility

This specification extends ENVITED-X functionality without modifying existing contracts. All FA2.1 assets remain compatible with Tezos Layer 1, and bridging is optional until a full transition to L2 is enacted.

## References

1. [Etherlink Documentation](https://docs.etherlink.com/)
2. [Tezos FA2.1 Standard](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-21/tzip-21.md)
3. [Optimistic Rollups in Tezos](https://research.tezos.com/optimistic-rollups)
4. [Bridging FA Tokens on Etherlink](https://docs.etherlink.com/bridging/bridging-fa)
5. [ERC-721 Standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/)
6. [Rio Protocol Announcement](https://research-development.nomadic-labs.com/rio-announcement.html)
7. [Rio Protocol Changelog](https://octez.tezos.com/docs/protocols/022_rio.html)

## Implementation

The initial bridge implementation follows the setup documented in the [ASCS smart contracts repository](https://github.com/ASCS-eV/smart-contracts/blob/main/etherlink-bridge/README.md).
Future iterations may include direct ticket issuance for improved efficiency, leveraging Rio protocol enhancements for streamlined bridging.
