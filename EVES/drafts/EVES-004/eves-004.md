---
eves-identifier: 004
title: ENVITED-X Roles and Responsibilities of EVES Editors
author: Carlo van Driesten (@jdsika); Daniel Liebert (@dansan566)
discussions-to:
status: Draft
type: Process
created: 2024-11-24
requires: ["EVES-001"]
replaces: None
---

## Abstract

This specification outlines the roles and responsibilities of EVES Editors and Approvers within the ENVITED Ecosystem Specifications (EVES) process.
Editors are tasked with maintaining the quality, consistency, and transparency of the EVES process, while Approvers hold the final voting authority to move a proposal from Candidate to Final.
By clearly defining their scopes, this document supports an effective and sustainable approach to managing the EVES lifecycle and fosters a collaborative, innovative environment.

## Motivation

Editors and Approvers are central to upholding the integrity of the ENVITED Ecosystem Specifications by ensuring proposals meet established standards and follow due process.
This specification clarifies each role’s tasks, empowering contributors to drive innovation while enabling Editors and Approvers to focus on their core responsibilities.
It further aligns with the formal EVES lifecycle set forth in [EVES-001](../EVES-001/eves-001.md), which introduced the **Approvers** role.

## Specification

This specification distinguishes between two formal roles: **Editors** and **Approvers**. Both are key to sustaining a transparent and high-quality EVES development process.

### 1. Roles of EVES Editors

#### 1.1 Custodians of the EVES Repository (Editors)

- Manage the EVES GitHub repository to keep it organized and accessible.  
- Oversee structural updates, file organization, and archiving of older EVES.

#### 1.2 Reviewers of Specifications (Editors)

- Ensure that submitted EVES adhere to the template, style guide, and community standards.  
- Provide feedback to authors to improve clarity, technical accuracy, and consistency.

#### 1.3 Facilitators of Community Discussions (Editors)

- Moderate discussions on GitHub including issues and pull requests.
- Encourage constructive feedback and active participation from stakeholders.

#### 1.4 Arbiters of Consensus (Editors)

- Confirm that community consensus has been reached before an EVES advances from Draft → Review → Candidate stages.  
- Mediate disagreements while remaining neutral in the editorial role.

#### 1.5 Standards Enforcers (Editors)

- Verify that proposals align with overarching governance and standards (e.g., Gaia-X, W3C, Tezos TZIPs).  
- Ensure interoperability within the ENVITED ecosystem.

#### 1.6 Approvers

- **Subset of Editors**: Approvers are a smaller group within the Editor pool, recognized by [EVES-001](../EVES-001/eves-001.md) as having additional voting authority to move an EVES from the Candidate to the Final stage.  
- **Final Decision Makers**: They review EVES that have reached Candidate status (which must include a working reference implementation) and vote on whether the EVES is ready to become Final.  
- **Voting Quorum**: EVES-001 requires at least two Approvers to confirm a proposal’s readiness for Final. Without meeting this quorum, the EVES remains in Candidate until further evidence, review, or revision is provided.  
- **Alignment with ENVITED Goals**: Approvers ensure each EVES is not only well-structured and implementable but also aligned with the strategic objectives of ENVITED-X and the broader ASCS e.V. membership.

### 2. Responsibilities of EVES Editors

Editors maintain their established responsibilities while collaborating with the newly introduced Approvers. The following responsibilities apply to Editors throughout the EVES process, from Draft creation to Finalization or Rejection.

#### 2.1 Pre-Submission

- Assist authors in structuring and formatting drafts according to the EVES template.  
- Provide guidance on proposal writing and GitHub submission processes.

#### 2.2 Submission and Review Process

1. **Initial Review**  
   - Check for completeness, adherence to the EVES template, and style guide compliance.  
   - Ensure that the submission aligns with the broader ENVITED-X or Gaia-X governance requirements.  
2. **Feedback Cycle**  
   - Return drafts with constructive feedback, suggested revisions, and further reading.  
   - Resolve conflicting or duplicate proposals in coordination with the community.  
3. **Editorial Approval**  
   - Editors grant the green light for an EVES to move into **Review** or **Candidate** status, contingent on meeting the exit criteria in [EVES-001](../EVES-001/eves-001.md).

#### 2.3 Community Engagement

- Organize and announce public reviews, calls, and feedback sessions.  
- Guarantee that diverse perspectives are included, including technical experts, domain specialists, and members of the ASCS e.V.

#### 2.4 Advancement Through the EVES Lifecycle

- Guide EVES through the Draft → Review → Candidate stages, ensuring the exit criteria are satisfied at each step.  
- Work closely with Approvers to confirm readiness for Final. Although Editors facilitate the process, the final decision is subject to Approvers’ votes.

#### 2.5 Governance and Accountability

- Uphold openness, inclusivity, and neutrality in editorial interactions.  
- Comply with the governance rules of the ENVITED Research Cluster and follow the conflict resolution mechanisms set forth in [EVES-001](../EVES-001/eves-001.md) and the [OpenMSL Governance Rules](https://openmsl.github.io/doc/OpenMSL/organization/governance_rules.html).

### 3. Responsibilities of Approvers

Approvers operate on top of the Editors’ responsibilities, taking an active role primarily when an EVES has entered the Candidate stage.

#### 3.1 Gatekeeping Candidate to Final

- Verify that the EVES has demonstrated feasibility via a working reference implementation.  
- Review any major technical or legal constraints to confirm the EVES can serve as an official standard or process reference.

#### 3.2 Voting Procedure

- **Quorum**: A minimum of two Approvers must confirm to move a Candidate EVES to Final.  
- **Neutrality and Fairness**: Approvers should weigh all community feedback, Editor recommendations, and test results from reference implementations before voting.

#### 3.3 Final Publication

- Once a successful vote is concluded, Approvers may instruct Editors to merge or publish the EVES as **Final**.  
- Oversee any minor editorial clarifications that may be integrated after Final approval.

### 4. Becoming an EVES Editor or Approver

#### 4.1 Application Process (Editors)

- Anyone interested in becoming an EVES Editor can open a discussion or issue in the ENVITED GitHub organization.  
- New editors are evaluated on their familiarity with the EVES process and willingness to adhere to editorial standards.

#### 4.2 Elevation to Approver

- Approvers are drawn from the existing Editor pool, typically based on demonstrated expertise and active involvement with EVES proposals.  
- Final confirmation may require a majority vote of existing Approvers or the ASCS e.V. ENVITED TSC, in keeping with local governance rules.

#### 4.3 Meetings

- Editors and Approvers hold open calls regularly. Links to these calls are pinned in the GitHub organization.  
- Meeting notes are stored in the `protocols/` folder within the EVES repository for public reference.

1. **Application Process**:
   - Anyone interested in becoming an EVES Editor can open a discussion in the ENVITED GitHub organization.
   - Tag the current editors group (e.g., `@eves-editors`) in the discussion for visibility.

2. **Eligibility**:
   - Applicants MUST demonstrate familiarity with the EVES process, template, and standards as defined in [EVES-001](../EVES-001/eves-001.md)) and this document.
   - New editors are welcome, and all qualified contributors can join to support the collaborative effort.

3. **Approval**:
   - The current editors will review the application and decide based on the applicant's demonstrated ability and willingness to adhere to the standards.

4. **Meetings**:
   - Editors meet regularly in open calls. Links to these calls are pinned in the GitHub organization.
   - Meeting protocols are stored in the `protocols/` folder within the EVES repository for transparency and accountability.

### 5. What EVES Editors and Approvers Are Not Responsible For

The following points clarify limits to the Editor and Approver roles:

1. **Creation of New EVES**  
   - Neither Editors nor Approvers drive the creation of new EVES; the community identifies needs, and authors propose solutions.  
2. **Technical Designs or Implementations**  
   - They do not craft or own the underlying technical designs (e.g., code libraries). The community or EVES authors lead the design, while Editors and Approvers review it for feasibility.  
3. **Promotion or Adoption**  
   - They are not tasked with marketing or ensuring the adoption of specific EVES. Deployment and integration lie with the community and stakeholders.  
4. **Post-Final Maintenance**  
   - Once an EVES is Final, it falls to the original authors or relevant contributors to maintain or propose updates. Major changes require a new EVES, as stated in [EVES-001](../EVES-001/eves-001.md).

### 6. Modular Governance Model

1. **Editors ensure process adherence**: They provide editorial consistency, confirm that proposals meet formal requirements, and moderate community input.  
2. **Approvers validate final readiness**: By voting on the Candidate → Final transition, Approvers function as a final gate to ensure quality and strategic alignment.  
3. **Community drives innovation**: Ideas originate from community members; they refine proposals, handle technical details, and implement reference solutions.

This modular governance ensures each role maintains focused responsibilities, thereby optimizing editorial efficiency and encouraging community-driven innovation.

## Backwards Compatibility

This EVES clarifies and expands the editorial process defined in EVE[S-001](../EVES-001/eves-001.md) by adding the Approvers role. It does not invalidate any previous guidelines and remains fully compatible with existing EVES. No retroactive changes are required; any references to “Editors” in older documents may be read inclusively to account for the separate Approvers subset going forward.

## References

1. [EVES-001: EVES Process Definition](../EVES-001/eves-001.md)  
2. [OpenMSL Governance Rules](https://openmsl.github.io/doc/OpenMSL/organization/governance_rules.html)  
3. [EIP-1: Ethereum Improvement Proposal Process](https://eips.ethereum.org/EIPS/eip-1) (Inspiration for open standards processes)

---

## Implementation

No direct implementation is required for this EVES. However, existing Editors and Approvers are encouraged to adopt these clarifications immediately for all in-flight and future EVES proposals.
