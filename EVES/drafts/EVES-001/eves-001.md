---
eves-identifier: 001
title: ENVITED-X Ecosystem Specification Process
author: Carlo van Driesten (@jdsika)
discussions-to: https://github.com/ASCS-eV/EVES/issues/9
status: Draft
type: Process
created: 19.11.2024
requires: None  
replaces: None  
---

## Abstract

This specification establishes the formal process for creating, editing, and approving ENVITED Ecosystem Specifications (EVES).
These specifications standardize and document implementation decisions for the ENVITED-X Data Space, promoting transparency, collaboration, and technical consistency within the ecosystem of the Automotive Solution Center for Simulation e.V. (ASCS).

## Motivation

A standardized process for EVES ensures clarity, inclusivity, and accountability in the evolution of the ENVITED ecosystem.
By defining roles, responsibilities, and lifecycle stages, this process aligns with best practices from similar initiatives, such as Chain Agnostic Improvement Proposals (CAIPs).

## Specification

### 1. EVES Lifecycle

The EVES lifecycle consists of the following stages:

1. **Draft**:
   - The EVES is created and submitted as a pull request to the GitHub repository.
   - Initial feedback is gathered informally.

2. **Review**:
   - EVES Editors ensure compliance with format and process guidelines.
   - The community provides input via GitHub discussions.

3. **Candidate**:
   - The EVES achieves community consensus.
   - A reference implementation must be created to demonstrate feasibility and validate the proposal.

4. **Final**:
   - The EVES undergoes final review by designated Approvers.
   - Upon approval, the EVES is merged and marked as Final.

5. **Deferred/Rejected**:
   - Proposals not meeting the required criteria or consensus may be deferred for future consideration or rejected.

### 2. EVES Numbering

EVES documents follow sequential numbering, starting from EVES-001, EVES-002, and so forth. This ensures easy identification and reference.

### 3. EVES Types

EVES documents can fall into one of the following types:

1. **Standards**:
   - Defines technical specifications or protocols that should be adopted by the ecosystem.
   - Examples: data formats, communication protocols, APIs.

2. **Informational**:
   - Provides general guidelines, explanations, or context for ecosystem participants.
   - Examples: best practices, usage recommendations.

3. **Process**:
   - Outlines procedural or governance rules that apply to the ENVITED community.
   - Examples: this EVES-001, editorial governance rules.

Each EVES type must be specified in the document header under the "Type" field.

### 4. Roles and Responsibilities

#### Author

- Any individual or group proposing an EVES.
- Responsible for drafting, gathering feedback, and revising the proposal.

#### Community

- All stakeholders who discuss, review, and provide input on EVES.

#### EVES Editors

- (Community-)Members of the ENVITED Research Cluster within ASCS.
- Oversee formatting, process adherence, and editorial mediation.
- Governed by the rules outlined [here](https://openmsl.github.io/doc/OpenMSL/organization/governance_rules.html).
- Roles and responsibilities specified in [EVES-004](https://github.com/ASCS-eV/EVES/blob/main/drafts/EVES-001/EVES-001.md).

#### Approvers

- A designated body within ASCS ENVITED community responsible for final evaluation and adoption.
- The body consists of EVES Editors with voting rights as full members of the ASCS e.V.

### 5. Reference Implementation

To proceed from Candidate to Final, a reference implementation must:

- Validate the proposal’s feasibility,
- Serve as a practical example for adoption,
- Be submitted alongside the EVES documentation.

### 6. Format

All EVES documents must adhere to the following structure:

1. **Title**: A descriptive and concise title.
2. **Abstract**: A summary of the proposal.
3. **Motivation**: The problem statement or justification for the proposal.
4. **Specification**: Detailed technical and procedural content.
5. **Rationale**: Explanation of the approach and alternatives considered.
6. **Backwards Compatibility**: Analysis of how the proposal interacts with existing systems.
7. **Implementation**: Guidelines or requirements for practical execution.
8. **References**: Links to related documents or discussions.

### 7. Process Flow

1. **Submission**:
   - Authors submit a pull request to the EVES GitHub repository.

2. **Editorial Review**:
   - EVES Editors review format and compliance with guidelines.

3. **Community Review**:
   - Open discussions and feedback via GitHub and other forums.

4. **Candidate Stage**:
   - Achieve community consensus and provide a reference implementation.

5. **Approval**:
   - Approvers review and mark the EVES as Final.

### 8. Governance

The process emphasizes openness, inclusivity, and accountability. Discussions, decisions, and documentation are publicly accessible on the EVES GitHub repository.
Governance rules for EVES Editors are defined [here](https://openmsl.github.io/doc/OpenMSL/organization/governance_rules.html).

## Backwards Compatibility

This process introduces new standards and does not conflict with prior procedures, as it establishes a foundational framework.

## References

1. [Chain Agnostic Improvement Proposals (CAIPs)](https://github.com/ChainAgnostic/CAIPs)
2. [OpenMSL Governance Rules](https://openmsl.github.io/doc/OpenMSL/organization/governance_rules.html)
3. [IPFS Specifications](https://github.com/ipfs/specs)

## Implementation

The initial implementation of EVES-001 involves:

1. Setting up the GitHub repository [here](https://github.com/ASCS-eV/EVES).
2. Establishing an editorial board from the ENVITED Research Cluster.
3. Publishing this document as EVES-001.
