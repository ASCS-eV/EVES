---
eves-identifier: 008
title: ENVITED-X SimpulseID Credential and Identity Framework
author: Carlo van Driesten (@jdsika)
discussions-to: https://github.com/ASCS-eV/credentials/blob/main/README.md
status: Draft
type: Process
created: 2025-11-28
requires: ["EVES-001", "EVES-002", "EVES-007"]
replaces: None
---

## Abstract

The SimpulseID Credential and Identity Framework defines the identity, membership, and credential architecture used within the ENVITED Ecosystem.
It specifies how organizations and natural persons are represented using W3C Verifiable Credentials v2, did:web identifiers, and Gaia‑X aligned semantics.
This EVES outlines the conceptual model, lifecycle, artifacts, and governance required for interoperable identity management in ENVITED.

## Motivation

The ENVITED Ecosystem requires a unified, privacy‑preserving identity model that supports trustable onboarding of organizations and users, program membership verification, and secure authentication across ENVITED services.
Existing identity systems are typically built around centralized identity federators such as Google or Microsoft, which introduce platform lock-in, limited user sovereignty, and dependencies on non-European infrastructure.
These systems lack standardized semantic foundations, interoperability across ecosystems, and cryptographically verifiable trust guarantees.
A European data-space environment like ENVITED requires an identity model that ensures sovereignty, avoids reliance on foreign identity providers, and supports open, verifiable, and interoperable credentials.  
SimpulseID addresses these issues by providing:

- A Gaia‑X aligned identity vocabulary  
- Machine‐verifiable membership credentials  
- did:web based decentralised identifiers with key rotation  
- OIDC4VP authentication integration  
- Clear governance roles for ASCS and participants  

This specification is necessary to maintain consistency across ENVITED applications, ensure long-term interoperability, and comply with European data space standards.

## Specification

### 1. Overview

SimpulseID defines five credential types and supporting semantic resources enabling verifiable identity and membership management:

- **Participant Credential** — Represents an organization.  
- **ASCS Base Membership Credential** — Establishes fundamental ASCS membership.  
- **ENVITED Membership Credential** — Extends membership for ENVITED services.  
- **Administrator Credential** — Granted by ASCS to privileged natural persons.  
- **User Credential** — Issued by participants to natural persons.  

All credentials use:

- W3C VC Data Model v2  
- JSON‑LD contexts hosted at `https://schema.ascs.digital/`  
- did:web identifiers under `did.identity.ascs.digital`  
- Gaia‑X Trust Framework 24.11 semantics (`gx:*`)  
- Harbour Credential Status for revocation tracking  

### 2. Lifecycle

#### 2.1 Organization Onboarding

1. Organization applies for ENVITED participation.  
2. ASCS issues:  
   - Participant Credential  
   - ASCS Base Membership Credential  
   - ENVITED Membership Credential (optional)  

#### 2.2 Administrator Onboarding

ASCS issues Administrator Credentials to individuals acting on behalf of ASCS or the participant.

#### 2.3 User Onboarding

Participant administrators create user DIDs and issue User Credentials.

#### 2.4 Authentication and Verification

1. Users authenticate via SSI‑to‑OIDC Bridge (OIDC4VP).  
2. Services verify credentials, contexts, and revocation status.  
3. DID resolution provides public keys and metadata.

### 3. Key Definitions and Components

#### 3.1 Decentralized Identifiers (did:web)

All ENVITED entities use did:web under:

```url
https://did.identity.ascs.digital/
```

Sub‑namespaces:

- `participants/<org>`  
- `programs/<membership>`  
- `users/<org>/u-<opaque-id>`  
- `users/ascs/admin-<opaque-id>`  

DIDs contain:

- Tezos `did:pkh` verification keys  
- Etherlink/EVM `eip155:42793` verification keys  
- No personal data  

#### 3.2 JSON‑LD Contexts

| Context | URL |
|--------|------|
| SimpulseID main context | <https://schema.ascs.digital/SimpulseIdCredentials/v1> |
| Legal form vocabulary | <https://schema.ascs.digital/SimpulseIdOntology/v1/legalForm> |
| Harbour revocation context | <https://schema.reachhaven.com/HarbourCredentials/v1> |

#### 3.3 Ontologies

Main ontology:  
`https://schema.ascs.digital/SimpulseIdOntology/v1`

Defines:

- Classes: Participant, Memberships, User, Administrator  
- Object properties: `simpulseid:legalForm`, `simpulseid:baseMembership`, `simpulseid:termsAndConditions`  
- vCard address properties  
- Gaia‑X identity alignment  

### 4. Reference Implementation

A full reference implementation exists in the public repository:

```url
https://github.com/ASCS-eV/credentials
```

It includes:

- Example credentials  
- Example did:web documents  
- Contexts  
- Ontologies  
- Wallet rendering manifests (Altme compatible)  

The SSI‑to‑OIDC bridge integration is provided via:  
<https://github.com/GAIA-X4PLC-AAD/ssi-to-oidc-bridge>

## Backwards Compatibility

This EVES introduces a new identity model and does not replace earlier ENVITED identity systems; however, it is fully interoperable with prior membership databases through mapping tables. No breaking changes are introduced to existing EVES documents.

## References

- W3C Verifiable Credentials v2  
- Gaia‑X Trust Framework 24.11  
- DIF Wallet Rendering Specification  
- JSON-LD 1.1  
- schema.org  
- vCard Ontology  
- EVES‑001: ENVITED Governance  
- EVES‑002: ENVITED Architecture  

## Implementation

To deploy SimpulseID:

1. Host contexts and ontologies at `https://schema.ascs.digital/`  
2. Host did:web documents at `https://did.identity.ascs.digital/`  
3. Use Altme wallets or any VC v2 wallet supporting OIDC4VP  
4. Integrate credential verification in ENVITED services via SSI-to-OIDC Bridge  
5. Maintain revocation registries accessible through does:web service endpoints  

Repository structure required for implementation:

```txt
/contexts
/examples
/examples/did-web
/manifests
/ontologies
```

This specification MUST be implemented by all ENVITED services handling identity, membership, or access control.
