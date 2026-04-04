---
eves-identifier: 008
title: ENVITED-X SimpulseID Credential and Identity Framework
author: Carlo van Driesten (@jdsika)
discussions-to: https://github.com/ASCS-eV/EVES/issues
status: Draft
type: Standards
created: 2025-11-28
requires: ["EVES-001", "EVES-002", "EVES-007", "EVES-009"]
replaces: None
---

## Abstract

The SimpulseID Credential and Identity Framework defines the identity, membership, and credential architecture used within the ENVITED Ecosystem.
It specifies how organizations and natural persons are represented using W3C Verifiable Credentials v2, `did:ethr` identifiers anchored on Base (ERC-1056), and Gaia-X aligned semantics.
The framework follows a schema-first approach using LinkML to derive JSON-LD contexts, OWL ontologies, and SHACL shapes from a single source schema.
This EVES outlines the conceptual model, credential types, lifecycle, semantic artifacts, and governance required for interoperable identity management in ENVITED.

## Motivation

The ENVITED Ecosystem requires a unified, privacy-preserving identity model that supports trustable onboarding of organizations and users, program membership verification, and secure authentication across ENVITED services.
Existing identity systems are typically built around centralized identity federators such as Google or Microsoft, which introduce platform lock-in, limited user sovereignty, and dependencies on non-European infrastructure.
These systems lack standardized semantic foundations, interoperability across ecosystems, and cryptographically verifiable trust guarantees.
A European data-space environment like ENVITED requires an identity model that ensures sovereignty, avoids reliance on foreign identity providers, and supports open, verifiable, and interoperable credentials.
SimpulseID addresses these issues by providing:

- A Gaia-X aligned identity vocabulary
- Machine-verifiable membership credentials
- `did:ethr` based decentralised identifiers anchored on Base (ERC-1056) with P-256 key management
- OIDC4VP authentication integration
- Clear governance roles for ASCS and participants

This specification is necessary to maintain consistency across ENVITED applications, ensure long-term interoperability, and comply with European data space standards.

## Specification

### 1. Overview

SimpulseID defines five credential types and supporting semantic resources enabling verifiable identity and membership management:

- **Participant Credential** (`simpulseid:ParticipantCredential`) --- Represents an organization as a verified legal person.
- **ASCS Base Membership Credential** (`simpulseid:AscsBaseMembershipCredential`) --- Establishes fundamental ASCS e.V. membership.
- **ASCS ENVITED Membership Credential** (`simpulseid:AscsEnvitedMembershipCredential`) --- Extends membership for ENVITED research cluster services.
- **Administrator Credential** (`simpulseid:AdministratorCredential`) --- Granted by ASCS to privileged natural persons.
- **User Credential** (`simpulseid:UserCredential`) --- Issued by ASCS to natural persons acting under a participant.

All credential types extend `HarbourCredential` from the Harbour credentials base schema. Each SimpulseID credential subject carries a mandatory `harbourCredential` IRI linking to a Harbour Gaia-X compliance credential, which serves as the baseline of trust.

All credentials MUST use:

- W3C VC Data Model v2
- JSON-LD contexts resolved via `w3id.org` persistent identifiers (see Section 3.2)
- `did:ethr` identifiers on Base (see Section 3.1)
- Gaia-X Trust Framework semantics (`gx:*`)
- Harbour Credential Revocation Set (`harbour:CRSetEntry`) for revocation (see Section 3.5)
- SHACL shapes for conformance validation

Credentials MAY carry evidence of prior issuance steps. The evidence protocol and verification are specified in [EVES-009](../EVES-009/eves-009.md).

### 2. Lifecycle

Credentials MUST be issued in the order specified below. Certain credentials have prerequisites that MUST be satisfied before issuance.

#### 2.1 Organization Onboarding

1. An organization applies for ENVITED participation.
2. ASCS verifies the organization's legal identity (registration number, address, Gaia-X compliance).
3. ASCS issues a **Participant Credential** attesting the organization as a `gx:LegalPerson`.
4. ASCS issues an **ASCS Base Membership Credential**. The Participant Credential MUST exist as a prerequisite and is referenced as evidence.
5. ASCS optionally issues an **ASCS ENVITED Membership Credential**. The Base Membership Credential MUST exist as a prerequisite, referenced via `baseMembershipCredential`.

#### 2.2 Administrator Onboarding

ASCS issues **Administrator Credentials** to natural persons acting on behalf of ASCS or a participant. The credential subject is typed `gx:NaturalPerson` and carries a `memberOf` reference to the participant organization DID.

#### 2.3 User Onboarding

ASCS issues **User Credentials** to natural persons. The credential subject is typed `gx:NaturalPerson` and carries a `memberOf` reference to the participant organization DID. User DIDs are created by participant administrators.

#### 2.4 Authentication and Verification

1. Users authenticate via the SSI-to-OIDC Bridge (OIDC4VP).
2. Services MUST verify credential signatures, JSON-LD context integrity, and revocation status.
3. DID resolution provides public keys and service metadata.
4. Evidence verification, when applicable, MUST follow [EVES-009](../EVES-009/eves-009.md).

### 3. Key Definitions and Components

#### 3.1 Decentralized Identifiers (did:ethr)

All ENVITED entities MUST use `did:ethr` identifiers anchored on Base via an [ERC-1056](https://eips.ethereum.org/EIPS/eip-1056) deployment and project-specific resolver.

| Network      | Chain ID | Hex       |
| ------------ | -------- | --------- |
| Base Sepolia | 84532    | `0x14a34` |
| Base Mainnet | 8453     | `0x2105`  |

DID format:

```text
did:ethr:<chainIdHex>:<ethereum-address>
```

Entity types and their DID patterns:

| Entity                 | Example DID                      |
| ---------------------- | -------------------------------- |
| Participant (ASCS)     | `did:ethr:0x14a34:0x5091...bb03` |
| Participant (e.g. BMW) | `did:ethr:0x14a34:0x9d27...1048` |
| Natural person         | `did:ethr:0x14a34:0xb2F7...b39a` |
| Infrastructure service | `did:ethr:0x14a34:0x4612...46d1` |
| Program definition     | `did:ethr:0x14a34:0x28b9...422D` |

**Key management**: Signing DID documents MUST expose P-256 keys as `JsonWebKey` verification methods.
The primary signing key is published as `#controller`; optional secondary keys appear as `#delegate-N`.
Non-signing DIDs (services, programs) MUST use the DID Core `controller` property to reference the governing participant DID rather than synthesising local signing keys.

**DID document structure**:

- Signing DIDs (participants, natural persons) MUST include `verificationMethod` with at least one P-256 `JsonWebKey`. The key MUST be referenced from both `authentication` and `assertionMethod` arrays.
- Signing DIDs MUST NOT have a document-level `controller` property (they are self-sovereign).
- Non-signing DIDs (programs, services) MUST have a document-level `controller` referencing the governing participant DID. They MUST NOT include `verificationMethod` (authority is delegated via the controller).

**Signature algorithm**: All credential signatures MUST use ES256 (ECDSA over P-256).

**Evidence holders**: Ephemeral evidence VP holders MAY use `did:key` for self-certifying identity. See [EVES-009](../EVES-009/eves-009.md) for the evidence protocol.

**Resolution**: DID documents are reconstructed from Base contract state and registered attributes by a project-specific resolver. The resolved documents are not assumed to match the default `ethr-did-resolver` secp256k1 recovery-key shape.

**DID documents MUST NOT contain personal data.** Personal attributes (name, email, address) are carried exclusively in credential subjects.

#### 3.2 JSON-LD Contexts

Every SimpulseID credential MUST include the following `@context` entries in order:

| Context              | URL                                            |
| -------------------- | ---------------------------------------------- |
| W3C VC Data Model v2 | `https://www.w3.org/ns/credentials/v2`         |
| Harbour core context | `https://w3id.org/reachhaven/harbour/core/v1/` |
| SimpulseID context   | `https://w3id.org/ascs-ev/simpulse-id/v1/`     |

Context URLs are `w3id.org` persistent identifiers that redirect to the generated JSON-LD context files. Implementers MUST NOT hard-code alternative URLs.
Note that the context path (`/simpulse-id/v1/`) differs from the LinkML schema identifier (`/simpulse-id/core/v1`) because the context is a generated artifact published at a separate redirect.

Example credential `@context`:

```json
{
  "@context": ["https://www.w3.org/ns/credentials/v2", "https://w3id.org/reachhaven/harbour/core/v1/", "https://w3id.org/ascs-ev/simpulse-id/v1/"]
}
```

The SimpulseID context uses `@vocab: simpulseid:` which resolves bare `@id` values to the `simpulseid:` namespace. W3C terms (e.g., `VerifiableCredential`, `issuer`, `validFrom`) remain bare; all domain types MUST use prefixed CURIEs (e.g., `simpulseid:ParticipantCredential`, `harbour:CRSetEntry`).

#### 3.3 Schema and Ontology

The SimpulseID schema is defined in [LinkML](https://linkml.io/) as the single source of truth:

| Artifact                  | Source / ID                                    |
| ------------------------- | ---------------------------------------------- |
| LinkML schema             | `https://w3id.org/ascs-ev/simpulse-id/core/v1` |
| Generated JSON-LD context | Derived via LinkML `ContextGenerator`          |
| Generated OWL ontology    | Derived via LinkML `OwlSchemaGenerator`        |
| Generated SHACL shapes    | Derived via LinkML `ShaclGenerator`            |

The schema defines:

- **Subject classes**: `simpulseid:OrganizationParticipant`, `simpulseid:Administrator`, `simpulseid:User`, `simpulseid:AscsBaseMembership`, `simpulseid:AscsEnvitedMembership`
- **Credential classes**: `simpulseid:ParticipantCredential`, `simpulseid:AdministratorCredential`, `simpulseid:UserCredential`, `simpulseid:AscsBaseMembershipCredential`, `simpulseid:AscsEnvitedMembershipCredential`
- **Key properties**: `simpulseid:harbourCredential` (mandatory IRI), `simpulseid:legalForm` (enum — see below), `simpulseid:baseMembershipCredential` (prerequisite IRI), `simpulseid:articlesOfAssociation`, `simpulseid:contributionRules`
- **Schema.org mappings**: `sdo:member`, `sdo:memberOf`, `sdo:programName`, `sdo:hostingOrganization`, `sdo:memberSince`, `sdo:publisher`
- **Gaia-X alignment**: `gx:LegalPerson`, `gx:NaturalPerson`, `gx:Address`, `gx:RegistrationNumber`, `gx:TermsAndConditions`

The `simpulseid:legalForm` enum constrains the legal form of participant organizations. Permissible values are enforced via `sh:in` in the generated SHACL shapes:

| Value                                                                                                                                    | Jurisdiction | Description                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------- |
| `GmbH`, `AG`, `UG`, `KG`, `OHG`, `GbR`, `Einzelunternehmen`                                                                              | DE           | German legal forms                          |
| `LLC`, `Corporation`, `LimitedPartnership`, `NonprofitCorporation`                                                                       | US           | United States legal forms                   |
| `LimitedCompany`, `LLP`, `CIC`, `CIO`, `SoleTrader`, `Partnership`, `Trust`, `UnincorporatedAssociation`, `CooperativeSociety`, `BenCom` | UK           | United Kingdom legal forms                  |
| `other`                                                                                                                                  | —            | Fallback for jurisdictions not listed above |

> **Note:** The `OrganizationParticipant` subject class was renamed from `Participant` to avoid a JSON-LD context collision with `gx:Participant` from the Gaia-X imports.
> The bare term "Participant" is claimed by Gaia-X, so the prefixed class URI `simpulseid:OrganizationParticipant` ensures correct RDF type resolution.

Implementers SHOULD use the generated SHACL shapes to validate credential payloads before issuance.

#### 3.4 Credential Subject Semantics

Credential subjects use two distinct identity patterns:

| Credential                      | `credentialSubject.id`  | Rationale                                               |
| ------------------------------- | ----------------------- | ------------------------------------------------------- |
| ParticipantCredential           | Organization `did:ethr` | The subject IS the organization                         |
| AdministratorCredential         | Person `did:ethr`       | The subject IS the natural person                       |
| UserCredential                  | Person `did:ethr`       | The subject IS the natural person                       |
| AscsBaseMembershipCredential    | `urn:uuid:<unique-id>`  | The subject is a membership relationship, not an entity |
| AscsEnvitedMembershipCredential | `urn:uuid:<unique-id>`  | The subject is a membership relationship, not an entity |

Membership credentials MUST use `urn:uuid:` identifiers to avoid RDF graph merge conflicts. If two membership credentials shared a participant DID as `credentialSubject.id`, loading both into one graph would merge all properties onto a single node.

**`member` vs `memberOf` convention**:

- `schema:member` is used **on the membership object**, pointing **to the member** (e.g., `AscsBaseMembership.member = <BMW DID>`).
- `schema:memberOf` is used **on the person**, pointing **to the organization** they belong to (e.g., `Administrator.memberOf = [<BMW DID>]`).

Implementers MUST NOT interchange these properties.

#### 3.5 Revocation

All SimpulseID credentials MUST include a `credentialStatus` array with at least one `harbour:CRSetEntry` entry:

```json
{
  "credentialStatus": [
    {
      "id": "<revocation-registry-did>/<status-hash>",
      "type": "harbour:CRSetEntry",
      "statusPurpose": "revocation"
    }
  ]
}
```

The `id` field is composed of the revocation registry service DID and a credential-specific hash. The registry service DID resolves to infrastructure managed by ASCS.

Verifiers MUST check revocation status before accepting any credential. The revocation registry is queryable via the DID service endpoint of the infrastructure service DID.

### 4. Reference Implementation

A full reference implementation exists in the public repository:

```url
https://github.com/ASCS-eV/simpulse-id-credentials
```

The repository follows a schema-first generation pipeline: the LinkML schema under `linkml/` is the single source from which JSON-LD contexts, OWL ontologies, and SHACL shapes are generated.

Repository structure:

```txt
/linkml           # LinkML source schemas and import map
/examples         # Unsigned credential examples (JSON-LD)
/examples/did-ethr  # Example did:ethr DID documents
/manifests        # Wallet rendering manifests (Altme / DIF compatible)
/artifacts        # Generated semantic artifacts (context, OWL, SHACL)
/docs             # Project documentation
/tests            # SHACL validation, integrity, and evidence-proof tests
/src              # Generation, signing, and verification scripts
```

The SSI-to-OIDC bridge integration is provided via:
<https://github.com/GAIA-X4PLC-AAD/ssi-to-oidc-bridge>

## Backwards Compatibility

This EVES introduces a new identity model and does not replace earlier ENVITED identity systems; however, it is fully interoperable with prior membership databases through mapping tables. No breaking changes are introduced to existing EVES documents.

## References

1. [W3C Verifiable Credentials Data Model v2](https://www.w3.org/TR/vc-data-model-2.0/)
2. [W3C Decentralized Identifiers (DIDs) v1.1](https://www.w3.org/TR/did-1.1/)
3. [ERC-1056: Ethereum Lightweight Identity](https://eips.ethereum.org/EIPS/eip-1056)
4. [did:ethr Method Specification](https://github.com/decentralized-identity/ethr-did-resolver/blob/master/doc/did-method-spec.md)
5. [Gaia-X Trust Framework](https://docs.gaia-x.eu/)
6. [Gaia-X ICAM 25.11](https://docs.gaia-x.eu/technical-committee/identity-credential-access-management/25.11/)
7. [LinkML --- Linked Data Modeling Language](https://linkml.io/)
8. [DIF Wallet Rendering Specification](https://identity.foundation/wallet-rendering/)
9. [JSON-LD 1.1](https://www.w3.org/TR/json-ld11/)
10. [schema.org](https://schema.org/)
11. [RFC 2119: Key Words for Use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119)
12. [EVES-001: ENVITED-X Ecosystem Specification Process](../EVES-001/eves-001.md)
13. [EVES-002: ENVITED-X Data Space Architecture Overview](../EVES-002/eves-002.md)
14. [EVES-007: ENVITED-X Blockchain Identifier URN Schema](../EVES-007/eves-007.md)
15. [EVES-009: ENVITED-X Evidence-Based Consent Using Verifiable Presentations](../EVES-009/eves-009.md)

## Implementation

To deploy SimpulseID:

1. Configure `w3id.org` redirects to serve generated JSON-LD contexts, OWL ontologies, and SHACL shapes from the reference repository.
2. Deploy a `did:ethr` resolver profile for Base (Sepolia for testing, Mainnet for production) with the project-specific `IdentityController` contract.
3. Use Altme wallets or any W3C VC v2 wallet supporting OIDC4VP for credential storage and presentation.
4. Integrate credential verification in ENVITED services via the SSI-to-OIDC Bridge.
5. Maintain revocation registries via `did:ethr` service endpoints managed by ASCS infrastructure.

Repository structure required for implementation:

```txt
/linkml             # Source schemas
/examples           # Credential and DID examples
/examples/did-ethr  # did:ethr DID document examples
/manifests          # Wallet rendering manifests
/artifacts          # Generated artifacts (context, OWL, SHACL)
```

This specification MUST be implemented by all ENVITED services handling identity, membership, or access control.
