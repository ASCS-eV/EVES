---
eves-identifier: 005
title: ENVITED-X Contract Negotiation Process
author: Felix Hoops (@jfelixh), Carlo van Driesten (@jdsika)
discussions-to:
status: Draft
type: Process
created: 2024-12-02
requires: ["EVES-001", "EVES-002", "EVES-003"]
replaces: None
---

## Abstract

A market place requires processes for publishing assets, negotiating contracts, and settling these contracts as a basis for services and billing.
We focus on the negotiation process, since it influences all of the other mentioned steps.
This document is not a technical specification, but rather a high-level process description.
Data standards and specific technology choices must be settled separately.

## Motivation

Gaia-X specifications on the topic are high-level (refer to [this](https://docs.gaia-x.eu/technical-committee/architecture-document/24.04/other_concepts/#computational-contracts)).
Existing implementations like the Eclipse Dataspace Connector's [negotiation](https://github.com/eclipse-dataspace-protocol-base/DataspaceProtocol/blob/main/negotiation/contract.negotiation.protocol.md) are complex.
Beyond that, we have specific goals that are not fulfilled by any specification we are aware of at the time of writing:

1. Ensure that the market place can mandate the use of pre-approved contract templates to ensure fairness and collect proportional fees.
2. Finalize contracts in a way that makes them fully provable to third parties, including timestamp, to give legal security to participants.
3. Limit the information that external parties or the market place operator have access to to a minimum required for safe operation.
4. Allow providers to make individual contracts per consumer if desired.
5. Represent the contracts as W3C Verifiable Credentials to leverage synergies with existing components in the decentralized ecosystem, specifically to easily make them usable for access control.

## Specification

### 1. Stakeholders

The ENVITED-X Data Space place _operator_ provides and maintains the market place infrastructure.
The operator also acts as a trust anchor giving access and verifiable identities to participants.
For these services, the operator collects fees from providers based on sales volume.

The _provider_ is interested in selling an asset.

The _consumer_ is interesting in buying an asset.

### 2. Initial Setup

The operator must set up a smart contract that allows anyone to retrieve a set of acceptable contract templates, which should have the form of ODRL policies.
The operator must run a _settlement service_ that can be used to settle contracts.
Contract credentials are only considered valid once their hash has been submitted to this service, which publishes the hash (directly or indirectly) on a blockchain.
We assume that the provider and consumer run a _negotiation service_ that consists of frontend and backend.
It could be a part of other infrastructure, such as the dataspace connector.
This services takes over communication between provider and consumer.

### 3. Asset Setup

The provider must register an asset as described in EVES-003.

### 4. Negotiation Process

The consumer uses metadata search or similar services to identify an asset of interest, before he contacts the provider to negotiate a contract.

1. The consumer asks the provider for a contract offer (i.e., quote) for the asset.
2. The provider creates a contract offer referencing a contract template.
   This offer contains specific data, such as pricing and usage requirements.
3. The provider sends the contract offer to the consumer in the form of a Verifiable Credential.
4. The consumer checks that the offer is correctly signed and that it references a valid contract template.
   The offer shall not conflict with the template.
5. If the consumer accepts, he constructs a contract credential, which wraps the contract offer.
6. The consumer sends this contract credential back to the provider, to ensure that both parties have the full contract without involving a third party.
7. The provider validates the contract credential.
   In this step, the provider could also choose to ignore the contract.
   For example, if the offer has expired.
8. The provider sends the hash of the contract credential to the operator's settlement service.
9. The settlement service locally saves the hash and which provider sent it.
   Then, the service commits just the hash to the public blockchain.
10. The consumer and provider monitor the blockchain to see if the contract has been settled.

At this point, the contract is fully settled and the consumer can use the asset.

### 5. Fee Payment

On a regular basis, the providers send the accumulated fees to the operator.
To ensure the fees are correctly calculated without publishing business statistics, a provider should construct a zero knowledge proof for the accumulated amount being correct based on the submitted hashes.

### 6. Limitations and Discussion

We assume that the provider and consumer have an interest in properly time-stamping their contract agreement.
This interest ensures that the operator is aware of any transaction that may generate fees.
Provider and consumer may add a status entry to their Verifiable Credentials to mark the contract or the offer in some way.
This could be useful in the case of a legal dispute to give a contract a disputed status or even entirely revoke it.

This negotiation process heavily limits data exposure, but some information beyond what what is exposed by necessity and design can still be learned:

1. Third Party

   - Can read number of contract agreements happening on the entire market place in a given time period.

2. Operator

   - Knows the number of contract agreements happening in a given time period for a given provider.

## Backwards Compatibility

This process does not conflict with prior EVES.

## References

## Implementation

This process is not yet implemented.
