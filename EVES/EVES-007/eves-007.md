---
eves-identifier: 007
title: ENVITED-X Blockchain Identifier URN Schema
author: Carlo van Driesten (@jdsika)
discussions-to:
status: Draft
type: Standards
created: 2025-03-04
requires: ["EVES-001", "EVES-002", "EVES-006"]
replaces: None
---

## Abstract

This specification defines a **uniform resource name (URN) schema** for uniquely identifying smart contracts and transaction hashes across multiple blockchains, including **Tezos, Ethereum, and Etherlink**.  
It ensures **compatibility with CAIP-10**, **DID:PKH**, and other **chain-agnostic specifications** by referencing standard chain namespaces and `chain_id` definitions.  
The URN schema provides a structured approach for **interoperable cross-chain asset management** and **transaction referencing**, aligning with the ENVITED-X Data Space architecture.

## Motivation

In blockchain-based ecosystems such as ENVITED-X, referencing **smart contracts** and **operations** requires a **standardized, human-readable, and resolvable format**.  
Existing solutions such as **CAIP-10 (Chain Agnostic Improvement Proposal 10)** define **account identifiers**, but they do not extend to **contract addresses and transaction hashes**.  
The lack of a unified schema creates **interoperability challenges** when integrating **Tezos (FA2.1, TZIP-21 metadata)**, **Ethereum (ERC-721, ERC-1155 NFTs)**, and **Etherlink (Optimistic Rollup Layer 2)** into the ENVITED-X Data Space.

This EVES addresses the gap by defining a **URN schema** that:

- Provides a **consistent, chain-agnostic way** to reference **smart contracts and transactions**.
- Aligns with **CAIP-10 conventions**, ensuring **namespace compatibility**.
- Supports **Tezos implicit (tz1, tz2, tz3) and originated (KT1) accounts**.
- Differentiates between **Layer 1 (Tezos, Ethereum) and Layer 2 (Etherlink)** transactions.

## Specification

### 1. URN Schema Definition

The URN schema follows a **structured format** using **blockchain namespaces**, ensuring **consistency and interoperability**.

#### 1.1 Smart Contract Identifiers

A **smart contract** is uniquely referenced using the following format:

```json
urn:blockchain:{chain_namespace}:{chain_id}:contract:{contract_address}
```

##### Smart Contract Example Mappings

| Blockchain              | Namespace | Chain ID          | Example URN |
|-------------------------|-----------|-------------------|--------------------------------------------------------------------------------------|
| **Tezos (Ghostnet)**    | `tezos`   | `NetXnHfVqm9iesp` | `urn:blockchain:tezos:NetXnHfVqm9iesp:contract:KT1PCaD2kmgCHy15wQ1gpqZUy9RLxyBVJdTF` |
| **Ethereum (Mainnet)**  | `eip155`  | `1`               | `urn:blockchain:eip155:1:contract:0xABC123456789...`                                 |
| **Etherlink (Layer 2)** | `eip155`  | `42793`           | `urn:blockchain:eip155:42793:contract:0x646B92C8f21e55DF67E766047E4bD7bEdF8DfA14`    |

> **_NOTE:_**
>
> - The **namespace** follows **CAIP-2** (e.g., `tezos`, `eip155` for Ethereum).
> - The **chain_id** follows **CAIP-10**, ensuring unique chain differentiation.
> - **Smart contracts (KT1, 0x) are explicitly named** under the `contract` identifier.

#### 1.2 Transaction Hash Identifiers

A **transaction (operation) hash** is referenced using:

```json
urn:blockchain:{chain_namespace}:{chain_id}:tx:{transaction_hash}
```

##### Transaction Example Mappings

| Blockchain              | Namespace  | Chain ID          | Example URN                                                                                         |
|-------------------------|------------|-------------------|-----------------------------------------------------------------------------------------------------|
| **Tezos (Ghostnet)**    | `tezos`    | `NetXnHfVqm9iesp` | `urn:blockchain:tezos:NetXnHfVqm9iesp:tx:oojtGLnHuS8og5WGf8jF8EoxTbegfrXvpxzvyPiW2GYZFGbFLaJ`       |
| **Ethereum (Mainnet)**  | `eip155`   | `1`               | `urn:blockchain:eip155:1:tx:0xad0fa6b98b66bc19ab4936d1181697ac7f1e19755e1501e4e250434200a32cba`     |
| **Etherlink (Layer 2)** | `eip155`   | `42793`           | `urn:blockchain:eip155:42793:tx:0xad0fa6b98b66bc19ab4936d1181697ac7f1e19755e1501e4e250434200a32cba` |

> **_NOTE:_**
>
> - **Operation hashes on Tezos are prefixed with `tx:`**.
> - **Ethereum and Etherlink transactions follow the Keccak-256 hash format**.

### 2. Standardization Considerations

- **CAIP-2 & CAIP-10 Alignment**:  
  - The `chain_namespace` and `chain_id` **strictly follow** CAIP-2 & CAIP-10 conventions.
  - `eip155`, `tezos` **retain compatibility with existing tooling**.
  
- **Layer 2 Distinction**:  
  - **Etherlink URNs explicitly specify their Layer 2 chain ID** (`ghostnet: 128123`, `mainnet: 42793`).
  - This prevents **collision between Layer 1 and Layer 2 assets**.

- **Human-Readable & Resolvable**:  
  - This URN structure can be used in **metadata files (TZIP-21, ERC-721)**.
  - Enables **cross-chain verification of contracts and operations**.

### 3. Use Cases

- **NFT Metadata (TZIP-21, ERC-721, ERC-1155)**
  - Store **contract & transaction references** in **token metadata** crosschain.

- **Cross-Chain Credential Verification (EVES-005, EVES-006)**
  - Supports contract-based **Verifiable Credentials (SD-JWT VC)**.

- **ENVITED-X Asset Tracking**
  - Standardized **contract and transaction tracking** across chains.

### **4. MIME Type for Blockchain URNs**

To ensure structured and standardized handling of **URN-based blockchain references**, this specification defines a MIME type for representing **contract and transaction identifiers** in a machine-readable format.  

#### **4.1 MIME Type Definition**

The following MIME type is introduced to denote **blockchain URNs** in JSON-based metadata and API responses:

```json
application/vnd.eves.blockchain-urn+json
```

#### **4.2 Rationale**

- **`application/`** → Indicates structured data.  
- **`vnd.eves.`** → Specifies the ENVITED-X standardization scope.  
- **`blockchain-urn`** → Clearly identifies the content as a **URN-based blockchain reference**.  
- **`+json`** → Specifies that the format is **compatible with JSON-based data structures**.

#### **4.3 Example Usage**

The MIME type is used in metadata files, API payloads, and verifiable credential documents where blockchain URN references are required.  

##### **Example: NFT Metadata (TZIP-21, ERC-721)**

```json
{
  "name": "Digital Twin Smart Contract",
  "artifactUri": "ipfs://bafybeidhmknqn4co...",
  "mimeType": "application/vnd.eves.blockchain-urn+json",
  "contractURN": "urn:blockchain:tezos:NetXnHfVqm9iesp:contract:KT1PCaD2kmgCHy15wQ1gpqZUy9RLxyBVJdTF",
  "mintingTx": "urn:blockchain:eip155:1:tx:0xad0fa6b98b66bc19ab4936d1181697ac7f1e19755e1501e4e250434200a32cba"
}
```

Example: API Response

```json
{
  "status": "success",
  "data": {
    "urn": "urn:blockchain:etherlink:ghostnet:contract:0xDEF987654321...",
    "mimeType": "application/vnd.eves.blockchain-urn+json"
  }
}
```

This MIME type ensures interoperability across blockchain networks, metadata specifications (TZIP-21, ERC-721), and decentralized identity frameworks (DID:PKH, SD-JWT).

## Backwards Compatibility

This EVES introduces a **new URN schema** but does not conflict with **existing CAIP-10, TZIP-21, or ERC-721 standards**.  
It is fully backward-compatible with Tezos, Ethereum, and Etherlink **without requiring changes to current implementations**.

## References

1. [CAIP-2: Blockchain Namespace Specification](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md)
2. [CAIP-10: Blockchain Account Specification](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-10.md)
3. [Tezos TZIP-21](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-21/tzip-21.md)
4. [Ethereum ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
5. [Etherlink Documentation](https://docs.etherlink.com/)
6. [Etherlink Network Information](https://docs.etherlink.com/get-started/network-information/)

## Implementation

- The ENVITED-X Data Space will **adopt this URN schema** in **metadata specifications** (see EVES-003, EVES-006).
- Future EVES will explore **URN resolvers** for cross-chain asset lookup.
