---
eves-identifier: 009
title: ENVITED-X Evidence-Based Consent Using Verifiable Presentations
author: Felix Hoops (@flhps)
discussions-to: https://github.com/ASCS-eV/EVES/issues/
status: Review
type: Standards
created: 2026-03-17
requires: ["EVES-001", "EVES-002"]
replaces: None
---

## Abstract

This specification defines a protocol for generating and verifying cryptographic evidence of user consent in the ENVITED-X Data Space.
It uses Verifiable Presentations (VPs) via OID4VP as the evidence format, binding consent to a specific action through a challenge-response mechanism.
The protocol enables services to act on behalf of users (for example, submitting blockchain transactions or finalizing contracts) while providing independently verifiable proof that the user authorized the action.

## Motivation

In the ENVITED-X Data Space, services frequently need to perform actions on behalf of users because users cannot directly perform these actions themselves with their SSI wallet.
A provider system may need to submit a blockchain transaction to list an asset, or issue a credential on behalf of a user.
In all cases, the service requires provable consent from the user before acting.

Traditional approaches require users to hold and manage blockchain-specific keys.
In a Verifiable Credential ecosystem, however, users already hold credentials in SSI wallets and authenticate via OpenID-based flows.
Requiring additional key management imposes unnecessary complexity and fragments the user experience.

This specification addresses the delegation problem by reusing the OID4VP protocol that users already interact with.
Users provide consent with their existing SSI wallet — no blockchain key management is needed.
The resulting evidence is a cryptographic artifact that:

- **Binds consent to a specific action** through a deterministic challenge derived from the message describing the action.
- **Is independently verifiable** by any party with access to the evidence, without requiring contact with the original Requester.
- **Serves as a tamper-proof audit trail** that can be stored and verified at any later point.
- **Supports privacy-preserving disclosure** when SD-JWT VCs are used, allowing Holders to present only the claims required.

The protocol is designed to be reusable across ENVITED-X processes.

## Specification

The specification is organized in two layers.
Sections 1–3 define the **generic** evidence model, which is independent of any particular credential or signature technology.
Sections 4–6 define the first **concrete profile** that realizes the generic model using Verifiable Presentations of SD-JWT VCs (`dc+sd-jwt`).
Future EVES MAY define additional profiles without changing the generic model.

### 1. Evidence (Generic)

Evidence is cryptographic proof that a specific user consented to a specific action.
At minimum, evidence consists of the following components:

- A **message** describing the action the user is consenting to.
- A **challenge** deterministically derived from that message via cryptographic hash function.
- A **signature object** proving the user saw and approved the message identified by the challenge.

The challenge binds the signature object to the message.
Any modification to the message produces a different challenge, invalidating existing signature objects.
This ensures that consent cannot be transferred from one action to another.

Three roles are involved in the evidence lifecycle:

- **Requester**: The service that needs evidence of user consent for a specific action (for example, to execute a blockchain transaction on the user's behalf). The Requester initiates the evidence request.
- **Holder**: The user whose consent is captured. The Holder reviews the action and approves or rejects the request.
- **Verifier**: Any party that checks whether a piece of evidence is valid.

The Requester and Verifier MAY be the same party or different parties.

The message format is not prescribed by this specification.
Implementations SHOULD include at minimum:

- A human-readable description of the action
- A domain, origin, or DID identifying the Requester
- A unique nonce ensuring the message is not reused
- A timestamp indicating when the message was created

[EIP-4361 (Sign-In with Ethereum)](https://eips.ethereum.org/EIPS/eip-4361) provides inspiration for structured message formats that include these elements.

A message MAY commit to a set of actions instead of a single one, for example through a cryptographic commitment such as a Merkle root.
A specification building on such messages MUST define how each individual action proves its inclusion in the commitment.
[EVES-010](../EVES-010/eves-010.md) uses this pattern to authorize the issuance of many credentials with a single piece of evidence.

Future EVES MAY define additional evidence types with different signature objects and challenge derivation mechanisms.
For example, a future type could bind the challenge through the OID4VP `transaction_data` mechanism once the necessary sub-specification and wallet support exist.

### 2. Evidence Creation Flow (Generic)

1. The Requester constructs a **message** describing the action and a **policy** specifying acceptable credentials.
2. A **challenge** is derived from the message.
3. The challenge and policy are presented to the Holder.
4. The Holder reviews the action and decides to approve or reject.
5. If approved, the Holder produces a **signature object** bound to the challenge.
6. The signature object is returned to the Requester, completing the evidence.

### 3. Evidence Verification (Generic)

A Verifier MUST confirm the following for evidence to be considered valid:

1. The **signature object** was produced by the claimed Holder.
2. The **signature object** is bound to the claimed message via the challenge.
3. The **credential requirements** specified in the policy are met (when VCs are present).

If any of these checks fail, the evidence MUST be considered invalid.

### 4. VP-Based Evidence (SD-JWT VC Profile)

This specification defines the first concrete evidence type using Verifiable Presentations.
This profile is defined **only** for Verifiable Credentials in the SD-JWT VC format (`dc+sd-jwt`, see [SD-JWT VC](https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/)).
SD-JWT VC builds on the SD-JWT mechanism defined in [RFC 9901](https://www.rfc-editor.org/rfc/rfc9901).
Verifiable Presentations using any other credential format are out of scope for this profile; a future EVES MAY define additional profiles for them.

The profile is designed around a practical constraint: identity wallets do not produce arbitrary signatures.
The only signature obtainable from a wallet is the Key Binding JWT (KB-JWT) of an OID4VP presentation.
This profile therefore uses the KB-JWT as the signature object and carries the challenge in a field the wallet signs as part of every presentation:

- The **challenge** is the SHA-256 hash of the message, computed over the exact bytes presented to the Holder and encoded as lowercase hexadecimal.
  The message is carried verbatim alongside the evidence and hashed as received; Verifiers MUST NOT re-render or normalize it.
  When a message must be regenerated from structured data rather than carried verbatim (for example, a JSON object), implementations SHOULD use a deterministic serialization
  such as [RFC 8785 (JSON Canonicalization Scheme)](https://www.rfc-editor.org/rfc/rfc8785) so that independent implementations derive an identical challenge.
- The **signature object** is a Verifiable Presentation (VP) of one or more `dc+sd-jwt` credentials. The evidence is the VP's KB-JWT, and the challenge is carried in the KB-JWT key-binding `nonce`.
- The VP contains one or more Verifiable Credentials (VCs) that prove the Holder's identity and attributes.
  Because a KB-JWT is only defined relative to a presented SD-JWT, every presentation includes at least one credential.
  A consent-only interaction is a normal OID4VP interaction in which the Requester requests a minimal identity credential, for example a natural person credential.

The challenge is bound to the evidence through the KB-JWT key-binding `nonce`.
This is the binding mechanism that ties the VP to the specific action.

The SD-JWT VC format is used because selective disclosure allows Holders to redact unnecessary claims, minimizing the personal data contained in the evidence.

A key advantage of VP-based evidence is that the VP can include VCs carrying authorization-related data.
For example, a VC might prove that the Holder's key is affiliated with a specific organization, or that the Holder holds a particular role.
This means evidence does not just prove consent — it proves _authorized_ consent.
The Requester communicates what VCs are needed as part of the standard OID4VP flow.

### 5. VP-Based Creation Flow (OID4VP)

The following sequence describes the VP-based evidence creation flow using [OpenID for Verifiable Presentations (OID4VP)](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html):

1. The Requester displays a **message**, the **challenge** derived from it, and a way to verify this challenge. The Requester also provides an OID4VP Authorization Request, for example via QR code.
2. The Holder ingests the request and the Holder's wallet downloads the request object containing the **challenge** and requested VCs.
3. The Holder selects matching VCs, reviews the challenge, and provides consent.
4. The wallet creates a VP with the challenge as the `nonce` and submits it via `direct_post` to the Requester.
5. The Requester verifies the VP and retains it — or a derived artifact containing at least the KB-JWT and the verbatim message — as evidence, which may be used to trigger further actions.

```mermaid
sequenceDiagram
    participant R as Requester
    participant H as Holder (Wallet)

    R->>R: Construct message + policy
    R->>R: challenge = hash(message)
    R->>H: OID4VP request (nonce=challenge, credential request)
    H->>H: Select VCs, review action
    H->>H: Create VP (nonce=challenge)
    H->>R: POST vp_token (direct_post)
    R->>R: Verify & store evidence
```

### 6. VP-Based Verification

For VP-based evidence, the Verifier MUST perform the following checks:

1. **Key binding verification**: The KB-JWT signature is verified against the confirmation (`cnf`) key of the presented SD-JWT per [RFC 9901](https://www.rfc-editor.org/rfc/rfc9901).
   When Holder keys are anchored in DID documents (see [W3C Decentralized Identifiers](https://www.w3.org/TR/did-core/)), the `cnf` key MUST correspond to a verification method of the Holder's DID.
2. **Credential verification**: Each `dc+sd-jwt` credential inside the VP is independently verified, including issuer signature validation and disclosure hash validation per [RFC 9901](https://www.rfc-editor.org/rfc/rfc9901).
3. **VC requirement check**: The presented VCs MUST satisfy the requirements that the Requester specified in the OID4VP request.
4. **Challenge binding**: The KB-JWT key-binding `nonce` MUST equal the challenge derived from the message as defined in section 4, and the KB-JWT `sd_hash` binding ([RFC 9901](https://www.rfc-editor.org/rfc/rfc9901) §4.3.1) MUST be verified. This binds the evidence to the specific action.
5. **Holder verification** (OPTIONAL): If a specific Holder was expected, the VP subject MUST match the expected Holder's identifier.

If any check fails, the evidence MUST be considered invalid.

These checks apply to a Verifier in possession of the complete VP — typically the Requester at presentation time.
A specification that persists a derived evidence artifact containing only parts of the VP MUST define which of these checks its Verifiers perform instead and how.
[EVES-010](../EVES-010/eves-010.md) defines such a derived artifact for credential issuance, retaining only the KB-JWT and the message.

### 7. Security Considerations

The following considerations apply to the generic evidence model:

- **Replay prevention**: Each message MUST include a unique nonce, ensuring that the derived challenge is unique per action. This prevents a signature object from being replayed for a different action with an identical message.
- **Message integrity**: The deterministic hash binding between message and challenge ensures that any modification to the message invalidates the evidence.
- **Deterministic challenge derivation**: Implementations MUST derive the challenge from the message deterministically. Otherwise two implementations could produce different challenges for the same logical message, breaking interoperability.
- **Time-bounding**: Implementations SHOULD set an expiration on evidence requests to prevent stale requests from being fulfilled after an unreasonable delay.
- **Holder binding**: The Requester MAY specify an expected Holder. If specified, the Verifier MUST check that the signature object's subject matches the expected Holder.
- **Key rotation**: When Holder keys are anchored in a DID document that can change over time, Verifiers SHOULD resolve the DID document as of the evidence creation time. Otherwise, legitimate key rotation would retroactively invalidate previously created evidence.
- **Policy immutability**: The policy associated with an evidence request MUST NOT be modified after the request is created. Changing the policy after the Holder has consented would invalidate the relationship between what was requested and what was approved.

The following considerations are specific to the VP-based profile:

- **Transport security**: OID4VP requests and responses MUST be transmitted over TLS. Implementations SHOULD use signed authorization requests to prevent tampering.
- **Credential freshness**: Verifiers SHOULD check the revocation status of presented VCs.
- **Trusted display**: The wallet displays only the challenge — an opaque hash — while the message itself is displayed by the Requester outside the wallet, for example on a website.
  The binding between what the Holder read and what the wallet signed therefore depends on the honesty of the Requester's display.
  Requesters MUST display the message together with the challenge and a way for the Holder to independently recompute the challenge from the message.
  Moving the message display into the wallet requires the OID4VP `transaction_data` mechanism, which remains future work until wallet support exists (see section 1).

### 8. Privacy Considerations

The following consideration applies to the generic evidence model:

- **Minimal disclosure**: Policies SHOULD request only the claims necessary for the specific action. Over-requesting claims exposes unnecessary personal data.

The following considerations are specific to the VP-based profile:

- **Selective disclosure**: Because the profile uses SD-JWT VCs, Holders present only the claims required by the policy. All other claims are redacted from the presentation.
- **Consent-only evidence**: When the policy does not require specific attributes, Requesters SHOULD request a minimal identity credential (for example, a natural person credential) and Holders SHOULD redact all claims not required by the policy.
- **Storage protection**: Stored evidence contains credential data and MUST be protected with appropriate access controls. Access to stored evidence SHOULD be limited to authorized parties on a need-to-know basis.

## Backwards Compatibility

This specification introduces a new protocol and does not modify any existing EVES.
It is compatible with the existing VC, DID, and wallet infrastructure described in [EVES-002](../EVES-002/eves-002.md).

## References

1. **EVES-001**: [ENVITED-X Ecosystem Specification Process](../EVES-001/eves-001.md)
2. **EVES-002**: [ENVITED-X Data Space Architecture Overview](../EVES-002/eves-002.md)
3. **OpenID for Verifiable Presentations (OID4VP)**: [Specification](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
4. **W3C Verifiable Credentials Data Model**: [Specification](https://www.w3.org/TR/vc-data-model/)
5. **W3C Decentralized Identifiers (DIDs)**: [Specification](https://www.w3.org/TR/did-core/)
6. **EIP-4361 (Sign-In with Ethereum / SIWE)**: [Specification](https://eips.ethereum.org/EIPS/eip-4361)
7. **RFC 2119**: [Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119)
8. **RFC 9901 (Selective Disclosure for JSON Web Tokens)**: [Specification](https://www.rfc-editor.org/rfc/rfc9901)
9. **SD-JWT-based Verifiable Credentials (SD-JWT VC)**: [Specification](https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/)
10. **RFC 8785 (JSON Canonicalization Scheme)**: [Specification](https://www.rfc-editor.org/rfc/rfc8785)
11. **EVES-010**: [ENVITED-X Credential Issuance Authorization via Embedded Evidence](../EVES-010/eves-010.md)

## Implementation

A reference implementation exists in **[harbour-credentials](https://github.com/reachhaven/harbour-credentials)** — a cryptographic library implementing SD-JWT VP issuance and verification, KB-JWT creation and verification, and challenge derivation.
It provides Python and TypeScript implementations with feature parity.

[EVES-010](../EVES-010/eves-010.md) applies this evidence protocol to credential issuance; its implementation is deployed in the [ENVITED-X Data Space](https://staging.envited-x.net).
