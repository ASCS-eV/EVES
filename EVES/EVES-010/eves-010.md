---
eves-identifier: "010"
title: ENVITED-X Credential Issuance Authorization via Embedded Evidence
author: Felix Hoops (@flhps)
discussions-to: https://github.com/ASCS-eV/EVES/issues/
status: Review
type: Standards
created: 2026-07-16
requires: ["EVES-001", "EVES-002", "EVES-008", "EVES-009"]
replaces: None
---

## Abstract

This specification applies the evidence protocol defined in [EVES-009](../EVES-009/eves-009.md) to credential issuance.
It defines how an authorizing organization approves the issuance of one or more credentials with a single wallet signature, and how each issued credential embeds a self-contained, independently verifiable record of that authorization in its `evidence` field.
The authorization message commits to the whole batch through a Merkle root; each credential carries the authorization signature together with its own inclusion proof.

## Motivation

In the ENVITED-X Data Space, credential proofs are executed by a signing service on behalf of sovereign issuers (see [EVES-008](../EVES-008/eves-008.md)).
The signing service executes the credential lifecycle but must not decide anything: every issuance requires provable authorization by the issuing organization.

This creates two requirements in tension:

- **One signature**: A common operation is an organization authorizing credentials for all of its members at once. The authorizing admin should sign once, not once per credential.
- **Self-contained verification**: Every issued credential must independently prove that it was covered by that authorization — without access to the rest of the batch and without contacting the issuing infrastructure.

This specification resolves the tension with a cryptographic commitment, using the multi-action message pattern from EVES-009:
the admin consents to a message committing to a Merkle root over the whole batch, and each issued credential carries an inclusion proof binding its own payload to that root.
The resulting evidence is embedded in the credential itself and serves as a durable, non-repudiable audit trail of who approved the issuance.
A signing service that issued a credential nobody authorized is detectable by any Verifier, because it cannot forge the admin's wallet signature.

## Specification

### 1. Roles

This specification refines the EVES-009 roles for the issuance setting:

- **Authorizer**: The issuing organization, identified by its DID. The authorization signature is made by a human admin whose wallet key is a verification method of that DID. The Authorizer is the EVES-009 **Holder**.
- **Signing Service**: The service that assembles the batch, obtains the authorization, embeds the evidence, and executes the credential proofs under a mandate from the issuer. The Signing Service is the EVES-009 **Requester**.
- **Intake Verifier**: The OID4VP verifier endpoint that receives the admin's presentation during the authorization ceremony and performs full EVES-009 verification.
- **Downstream Verifier**: Any relying party that later verifies an issued credential and its embedded evidence in isolation.

### 2. Authorization Message

The authorization message is a human-readable text string following the EVES-009 message requirements, styled after [EIP-4361 (Sign-In with Ethereum)](https://eips.ethereum.org/EIPS/eip-4361).
It is composed by the Signing Service, displayed verbatim on the admin's wallet consent screen, and carried byte-exact in the evidence.

The message MUST contain exactly one statement line matching the following template:

```text
I authorize the issuance of <N> credential(s) committed to by Merkle root <root>.
```

Where `<N>` is the decimal batch size and `<root>` is the base64url-encoded (unpadded, 43 characters) SHA-256 Merkle root over the batch.
Verifiers extract the root only through this template.

All other message content — domain, Authorizer address, ceremony nonce, and timestamp — is ceremony metadata.
It is part of the hashed message but not interpreted by Verifiers.
The ceremony nonce and timestamp inside the hashed message make every ceremony's challenge unique, satisfying the EVES-009 replay prevention requirement.

Following EVES-009, the message is hashed exactly as received: the **challenge** is `SHA-256(message)` in lowercase hexadecimal encoding, and Verifiers MUST NOT re-render or normalize the message.

### 3. Evidence Creation

1. The Signing Service computes a leaf hash for each credential payload in the batch. The leaf is computed over the payload with its `evidence` and `proof` members removed, so the leaf is independent of the evidence that will later embed the proof of its own inclusion.
2. The Signing Service builds a Merkle tree over the leaves and composes the authorization message committing to its root (see section 2).
3. The admin provides consent through the EVES-009 VP-based flow: the wallet receives an OID4VP presentation request whose `nonce` is the challenge, displays the message,
   and responds by presenting the organization's LegalPersonCredential (see EVES-008) with a KB-JWT signed by the admin's wallet key.
4. The Intake Verifier performs full EVES-009 verification of the presentation (see section 5.1).
5. For each credential in the batch, the Signing Service constructs an evidence object (see section 4) and embeds it in the credential's `evidence` array before the credential is signed as `dc+sd-jwt`.

Only the KB-JWT is retained from the presentation.
The presented credential itself is not carried in the evidence; the Authorizer's authority is verifiable through its DID document instead (see section 5.2).

### 4. Evidence Structure

Each issued credential carries one evidence object with the following components:

- **`authorizedBy`**: The Authorizer organization's DID.
- **`authorization`**: The KB-JWT obtained in the authorization ceremony — the EVES-009 signature object. Its `nonce` carries the challenge, and its `iat` timestamps the authorization.
- **`authorizationMessage`**: The verbatim authorization message — the EVES-009 message.
- **`merkleProof`**: The credential's inclusion proof — the ordered list of sibling digests from the credential's leaf up to the committed root.

The exact Merkle tree construction, leaf encoding, and JSON-LD vocabulary are specified in the
[Harbour Batched Credential Evidence specification](https://github.com/reachhaven/harbour-credentials/blob/main/docs/specs/batched-credential-evidence.md),
which serves as the normative wire-format reference for this EVES.

Because the issuer's `dc+sd-jwt` signature covers the credential payload including the `evidence` array, the embedded evidence is tamper-evident: it cannot be stripped or replaced without invalidating the credential.

### 5. Verification

Verification happens at two distinct points in time, by two distinct parties, with different material available.

#### 5.1 Intake Verification

The Intake Verifier holds the complete presentation and MUST perform the full EVES-009 VP-based verification, including credential verification, `sd_hash` validation, and challenge binding.
Additionally, the Intake Verifier MUST reject an authorization whose KB-JWT `aud` is not its own identifier.

#### 5.2 Downstream Verification

A Downstream Verifier verifies one issued credential and its evidence in isolation.
It holds only the derived evidence artifact (see section 4), not the presentation, and MUST perform the following checks:

1. **Authorization signature**: The KB-JWT signature verifies against a verification method of the `authorizedBy` DID document, resolved as of the KB-JWT `iat`
   (see EVES-009 key rotation consideration). The KB-JWT `typ` header MUST be `kb+jwt`.
2. **Challenge binding**: The KB-JWT `nonce` MUST equal `SHA-256(authorizationMessage)` in lowercase hexadecimal encoding, computed over the message exactly as carried.
3. **Commitment extraction**: The message MUST contain exactly one statement line matching the template in section 2; the Merkle root is extracted from it.
4. **Inclusion**: The credential's leaf, recomputed from its payload with `evidence` and `proof` removed, MUST fold to the committed root through the `merkleProof` path.
5. **Issuer binding**: When the issued credential is an EVES-008 identity credential, `authorizedBy` MUST equal the credential's `issuer`.

If any check fails, the evidence MUST be considered invalid.

A Downstream Verifier MUST treat the KB-JWT `sd_hash` and `aud` claims as opaque: the presentation they refer to is not available, and no verification decision may be based on them.
This is the derived-artifact check profile required by EVES-009 section 6.

### 6. Security Considerations

The EVES-009 security considerations apply.
In addition:

- **Replay across batches**: The ceremony nonce and timestamp inside the hashed message guarantee a unique challenge per ceremony, so an authorization KB-JWT can never be replayed for a different batch — even one committing to an identical root.
- **Historical key resolution**: Downstream Verifiers MUST resolve the `authorizedBy` DID document as of the KB-JWT `iat`. Later key rotation or admin offboarding does not retroactively invalidate evidence that was validly authorized.
- **Audience binding**: The intake `aud` check prevents an authorization obtained by one verifier from being forwarded to and accepted by another.
- **Unauthorized issuance detection**: Because every Downstream Verifier checks the evidence, a Signing Service that issues credentials without authorization produces detectably invalid credentials — it cannot forge the admin's wallet signature.
- **Evidence integrity**: The issuer signature over the credential covers the embedded evidence, making removal or substitution of evidence tamper-evident.

### 7. Privacy Considerations

The EVES-009 privacy considerations apply.
In addition:

- **Message content**: The authorization message SHOULD contain no personal data beyond the Authorizer's DID. The batch is referenced only through its Merkle root.
- **Batch opacity**: An inclusion proof reveals the batch size and sibling digests, but not the contents of other credentials in the batch — the digests are preimage-resistant hashes.
- **Evidence visibility**: The evidence travels with the credential and is visible to every party the credential is presented to.
  It reveals the authorization ceremony metadata (Authorizer DID, batch size, timestamp) and nothing about the credential subject beyond what the credential itself discloses.

## Backwards Compatibility

This specification introduces a new mechanism and does not modify any existing EVES.
It instantiates the EVES-009 evidence protocol for credential issuance and is compatible with the credential and identity framework defined in [EVES-008](../EVES-008/eves-008.md).

## References

1. **EVES-001**: [ENVITED-X Ecosystem Specification Process](../EVES-001/eves-001.md)
2. **EVES-002**: [ENVITED-X Data Space Architecture Overview](../EVES-002/eves-002.md)
3. **EVES-008**: [ENVITED-X SimpulseID Credential and Identity Framework](../EVES-008/eves-008.md)
4. **EVES-009**: [ENVITED-X Evidence-Based Consent Using Verifiable Presentations](../EVES-009/eves-009.md)
5. **OpenID for Verifiable Presentations (OID4VP)**: [Specification](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
6. **RFC 9901 (SD-JWT-based Verifiable Credentials)**: [Specification](https://www.rfc-editor.org/rfc/rfc9901)
7. **W3C Decentralized Identifiers (DIDs)**: [Specification](https://www.w3.org/TR/did-core/)
8. **EIP-4361 (Sign-In with Ethereum / SIWE)**: [Specification](https://eips.ethereum.org/EIPS/eip-4361)
9. **RFC 2119**: [Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119)
10. **Harbour Batched Credential Evidence Specification**: [Specification](https://github.com/reachhaven/harbour-credentials/blob/main/docs/specs/batched-credential-evidence.md)

## Implementation

A reference implementation exists in **[harbour-credentials](https://github.com/reachhaven/harbour-credentials)** (Python and TypeScript with feature parity), covering evidence creation, the authorization message grammar, Merkle tree construction, and both verification tiers.
The mechanism is deployed in the [ENVITED-X Data Space](https://staging.envited-x.net), where the intake ceremony runs through the gatehouse signature API.
