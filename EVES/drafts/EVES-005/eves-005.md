---
eves-identifier: 005
title: ENVITED-X Contract Negotiation Process
author: Felix Hoops (@jfelixh), Carlo van Driesten (@jdsika)
discussions-to: https://github.com/ASCS-eV/EVES/issues/
status: Draft
type: Process
created: 2024-12-02
requires: ["EVES-001", "EVES-002", "EVES-003", "EVES-006"]
replaces: None
---

## Abstract

This specification defines a contract negotiation process for the ENVITED-X Data Space.
In our approach, a contract is represented as a verifiable credential (VC) based on SD-JWT (see [SD-JWT-based Verifiable Credentials (SD-JWT VC)](https://www.ietf.org/archive/id/draft-ietf-oauth-sd-jwt-vc-00.html) and [OpenID for Verifiable Credential Issuance - draft 15](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)), exchanged between a provider and a consumer via an encrypted inbox system.
 In the finalized state, the mutually signed VC — with its hash and UUID stored in a decentralized registry on Etherlink (see [EVES-006](../EVES-006/eves-006.md) and [CRSet: on-Interactive Verifiable Credential Revocation with Metadata Privacy for Issuers and Everyone Else](https://arxiv.org/pdf/2501.17089)) — serves as a provable contract that authorizes access to data only when both a valid VC and a valid registry entry are present.

## Motivation

Traditional negotiation protocols (e.g., as described in the [Eclipse Dataspace Protocol](https://github.com/eclipse-dataspace-protocol-base/DataspaceProtocol/tree/main/artifacts/src/main/resources/negotiation)) are complex and tend to expose excessive information.
Our process is designed to:

- Mandate the use of pre-approved, ODRL-compatible contract templates.
- Ensure legal security by finalizing contracts as signed VCs that are timestamped and stored in a blockchain registry.
- Minimize manual interaction through an encrypted inbox system (optionally encrypted with DID keys) and automated state transitions where possible.
- Enforce access control by requiring both a valid VC and a valid registry entry.

## Specification

### 1. Overview of the Contract Negotiation Flow

The negotiation process follows the dataspace protocol state machine with the following states (note that some state transitions may be automated without direct user interaction):

- **REQUESTED:**  
  The consumer initiates a negotiation by sending a contract request (for example, to request a quote for an asset to purchase and download).
  This action is manually triggered by the consumer.

- **OFFERED:**  
  The provider responds by generating a contract offer encapsulated as a VC.
  The provider signs this offer using its SD-JWT key and sends it via the encrypted inbox.
  _Automation is possible under preset conditions, but this step requires explicit user consent by default._

- **ACCEPTED:**  
  The consumer verifies the providers’s signature and reviews the offer payload.
  The consumer signs the VC to indicate acceptance.
  The signed VC is transmitted back to the provider.
  _Automation is possible under preset conditions, but this step requires explicit user consent by default._

- **AGREED:**  
  The provider verifies the consumer’s signature and the payload content.
  The acceptance is automated as the offer was already signed in the state OFFERED.
  Instead of adding an additional signature, the provider indicates agreement by recording a successful entry (with the hash and UUID of the signed VC) in the decentralized registry on Etherlink.
  This registry entry confirms the agreement and is the key to transitioning the process to the VERIFIED state.

- **VERIFIED:**  
  The consumer, upon receiving confirmation that the provider has recorded the agreement in the registry, verifies that the registry entry exists and that all conditions are met.
  _This verification can be automated._

- **FINALIZED:**  
  With both parties’ signatures in place and a successful registry entry confirming provider agreement, the contract negotiation is finalized.
  Both the provider and consumer can download the finalized signed VC as proof of contract.
  Access to the contracted asset is authorized only when the VC is valid and a corresponding registry entry is found and valid.

- **TERMINATED:**  
  If any error occurs (e.g., invalid signatures, mismatched payloads, or a timeout) or if either party cancels the negotiation, the process transitions to the terminated state.

### 2. Detailed Process Flow Example

#### Example Scenario: Purchase and Download of an Asset

1. **Consumer Initiation (REQUESTED):**  
   The consumer sends a contract request for a specific asset (discovered via metadata search) using the application interface.
   This request is delivered to the provider’s encrypted inbox.

2. **Provider Offer (OFFERED):**  
   The provider generates a contract offer that conforms to ODRL standards.
   The offer is encapsulated as an SD-JWT VC, signed by the provider, and sent back through the encrypted inbox.

3. **Consumer Acceptance (ACCEPTED):**  
   The consumer reviews the signed offer and, if the terms meet their requirements, signs the VC to indicate acceptance.
   The consumer’s signed VC is returned to the provider via the secure channel.

4. **Provider Verification & Registry Entry (AGREED):**  
   Upon receiving the consumer’s signed VC, the provider verifies the signature and payload.
   The provider then records a successful entry in the decentralized registry on Etherlink — this registry entry (comprising the VC’s hash and UUID) confirms the agreement and allows the process to progress to the VERIFIED state.

5. **Consumer Verification of Registry Entry (VERIFIED):**
    The consumer verifies if the registry entry is correctly caught by the indexer automatically transitioning to the FINALIZED state.

6. **Finalization (FINALIZED):**  
   Once the registry entry is confirmed, both parties can download the finalized contract VC from their respective systems.
   This finalized VC, along with its corresponding registry entry, serves as proof of contract and authorizes access to the asset.

7. **Error or Cancellation (TERMINATED):**  
   If any step fails (for example, if signatures are invalid or a timeout occurs), the negotiation process is terminated.
   Both parties are notified of the termination, and no contract is recorded in the registry.

### 3. Technical Considerations

- **Verifiable Credential Format:**  
  The contract VC conforms to the SD-JWT VC specification (see [SD-JWT-based Verifiable Credentials (SD-JWT VC)](https://www.ietf.org/archive/id/draft-ietf-oauth-sd-jwt-vc-00.html) and [OpenID for Verifiable Credential Issuance - draft 15](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)).
  It is intended for storage in wallets (e.g., Altme) and can be presented to endpoints running the [ssi-to-oidc-bridge](https://github.com/GAIA-X4PLC-AAD/ssi-to-oidc-bridge).

- **Decentralized Registry and Scaling:**  
  Following the method outlined in [EVES-006](../EVES-006/eves-006.md) and inspired by [this paper](https://arxiv.org/pdf/2501.17089), a blockchain-based registry on Etherlink is used to store the hash and UUID of finalized VCs.
  Authorization to access assets is granted only when the presented VC is valid and a valid corresponding registry entry exists.

- **Automation and Encrypted Inbox:**  
  An encrypted inbox system — optionally secured with DID keys  - is used to exchange contract-related VCs.
  The design minimizes manual interaction by automating transitions (e.g., from OFFERED to ACCEPTED under preset criteria) while still allowing explicit user confirmation when needed.

- **State Machine Integration:**  
  The process adheres to the dataspace protocol state machine with the following states:  
  **REQUESTED → OFFERED → ACCEPTED → AGREED → VERIFIED → FINALIZED → TERMINATED.**  
  Each state transition may be executed automatically by the system if predefined conditions are met, reducing the need for continuous manual intervention.

### 4. Stakeholders

The following stakeholders are involved in the contract negotiation process:

- **Consumer:**  
  Initiates contract requests, reviews offers, and signs contract VCs to indicate acceptance.

- **Provider:**  
  Generates contract offers as signed VCs, verifies consumer signatures, and confirms agreement by recording a successful entry in the decentralized registry.

- **ENVITED-X Data Space Operator:**  
  Oversees the marketplace infrastructure and the decentralized registry.
  The operator has the authority to review registry entries and, via selective disclosure, verify the fee amount due for each successful contract.
  This fee information is used for billing and service settlement purposes.

## 5. Fee Payment

Each provider is responsible for cumulating the fees due for each finalized contract — that is, for every contract VC that has a valid entry in the registry.
Fees are calculated over a defined period (for example, yearly) and are submitted to the ENVITED-X Data Space Operator.
Using selective disclosure and referencing the registry entry, the operator can verify the validity and accuracy of the fees reported.
This mechanism ensures transparency, auditability, and accountability in fee payments.

### 6. Privacy Considerations

Privacy is a core aspect of the ENVITED-X contract negotiation process.
Key privacy measures include:

- **Encrypted Communication:**  
  All contract-related messages are exchanged via an encrypted inbox system, optionally secured using DID keys.
  This ensures that sensitive contract data and personal identifiers are transmitted securely.

- **Selective Disclosure in VCs:**  
  The verifiable credentials used in the process are designed for selective disclosure, allowing parties to reveal only the necessary attributes required for contract verification while keeping other details confidential.

- **Minimal Data in the Registry:**  
  The decentralized registry on Etherlink stores only the hash and UUID of the finalized contract VC, rather than the full contents of the credential.
  This approach minimizes exposure of sensitive information while still enabling proof of contract.

- **Access Control:**  
  Access to contracted assets is strictly regulated.
  Authorization requires both a valid, signed VC and a corresponding entry in the decentralized registry, ensuring that only authorized parties can access sensitive data.

- **Operator Oversight with Privacy Safeguards:**  
  Although the ENVITED-X Data Space operator can review registry entries for fee calculation and auditing, the operator does not gain access to the full contract details.
  Selective disclosure mechanisms ensure that only the minimal required information is revealed during fee management and settlement.

### 7. References

1. **Dataspace Protocol:**  
   - [Dataspace Protocol – Official Knowledgebase](https://docs.internationaldataspaces.org/ids-knowledgebase/dataspace-protocol)  
   - [Eclipse Dataspace Protocol Editor's Draft](https://eclipse-dataspace-protocol-base.github.io/DataspaceProtocol/)

2. **SD-JWT-based Verifiable Credentials:**  
   - [SD-JWT Specification](https://www.ietf.org/archive/id/draft-ietf-oauth-sd-jwt-vc-00.html)

3. **OpenID for VC Issuance:**  
   - [OpenID for Verifiable Credential Issuance](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)

4. **SSI-to-OIDC Bridge:**  
   - [ssi-to-oidc-bridge Repository](https://github.com/GAIA-X4PLC-AAD/ssi-to-oidc-bridge)

5. **Scaling and Decentralized Registry:**  
   - [EVES-006: ENVITED-X Scaling Architecture](../EVES-006/eves-006.md)  
   - [Decentralized Registry Paper DRAFT](https://arxiv.org/pdf/2501.17089)

6. **ODRL Standard:**  
   - [ODRL Information Model 2.2](https://www.w3.org/TR/odrl-model/)

7. **Additional Guidance:**  
   - [Eclipse Dataspace Protocol – Contract Negotiation Protocol](https://github.com/eclipse-dataspace-protocol-base/DataspaceProtocol/tree/main/artifacts/src/main/resources/negotiation)

## Backwards Compatibility

This process extends the existing ENVITED-X contract and asset procedures (refer to EVES-001 through EVES-003) without conflicting with previous specifications.
It introduces a VC-based contract negotiation that interoperates with the dataspace protocol and blockchain registry mechanisms with an overview in [EVES-002](../EVES-002/eves-002.md).

## Implementation

Initial implementation steps include:

1. **Establishing the Encrypted Inbox:**  
   Set up a secure messaging channel (optionally encrypted with DID keys) to facilitate the VC exchange with minimal interaction.

2. **VC Generation and Signing:**  
   Implement services to generate SD-JWT VCs for contract offers and acceptances.
   Both provider and consumer systems must support signing operations and storage (e.g., in wallets like Altme).

3. **Blockchain Registry Integration:**  
   Integrate with the decentralized registry on Etherlink to store the hash and UUID of finalized contract VCs.
   The provider must record a registry entry to transition the state from AGREED to FINALIZED.

4. **Automated State Transitions:**  
   Where possible, automate state transitions (e.g., from OFFERED to ACCEPTED or AGREED) while allowing manual intervention if necessary.

5. **Operator Fee Management:**  
   The ENVITED-X Data Space operator reviews registry entries to verify successful contracts.
   Using selective disclosure mechanisms, the operator verifies the fee due reported by the provider for each successful contract, facilitating billing and settlement processes.

6. **Example Workflow Testing:**  
   Validate the process using a test scenario where a consumer requests a quote for an asset, receives a signed offer, accepts it, and both parties download the finalized contract VC as proof.
   The registry entry is then verified to authorize data access.
