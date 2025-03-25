---
eves-identifier: 003
title: ENVITED-X Asset Definition and Upload Process
author: Carlo van Driesten (@jdsika)
discussions-to: https://github.com/ASCS-eV/EVES/issues/4
status: Review
type: Standards
created: 2024-11-19
requires: ["EVES-001"]
replaces: None
---

## Abstract

This specification defines the structure of an asset in the ENVITED-X Data Space and outlines the process for uploading assets to ensure compliance, security, and interoperability.
It leverages existing standards, such as the Gaia-X 4 PLC-AAD Manifest Ontology, and implements privacy layers, validation, and metadata mapping aligned with [Tezos TZIP-21](https://docs.tezos.com/architecture/governance/improvement-process#tzip-21-rich-contract-metadata).

## Motivation

Standardizing the definition and upload process for assets in the ENVITED-X Data Space ensures:

- Interoperability with existing Gaia-X data spaces.
- Security through CID-based identification and metadata validation.
- Scalability for integrating diverse asset types.

This EVES addresses the need for clear guidelines to onboard assets and synchronize data with ENVITED-X systems.

## Specification

### 1. Asset Definition

The EVES-003 Simulation Asset is defined by the [Gaia-X 4 PLC-AAD ENVITED-X Ontology](https://github.com/ASCS-eV/ontology-management-base/tree/main/envited-x) version `https://ontologies.envited-x.net/envited-x/v2/ontology#`.
It is compliant with the [Gaia-X ontology and SHACL shapes 2210](https://github.com/GAIA-X4PLC-AAD/ontology-management-base/tree/main/gx) which are derived from [GaiaX Trust Framework](https://registry.lab.gaia-x.eu/v1/api/trusted-schemas-registry/v2/schemas/gax-trust-framework) including the [https://registry.lab.gaia-x.eu/v1/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#](https://registry.lab.gaia-x.eu/v1/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#). A [GaiaX Compliant Claims Example](https://github.com/GAIA-X4PLC-AAD/gaia-x-compliant-claims-example) can be generated using the [GaiaX 4 PLC-AAD Claim Compliance Provider](https://github.com/GAIA-X4PLC-AAD/claim-compliance-provider).

The example implementation in the 📁 `metadata/` folder is based on release v0.2.3 of the [ASCS HD-Map Asset Example](https://github.com/ASCS-eV/hd-map-asset-example/releases/tag/v0.2.3).

Asset examples can be found in the following repositories:

- [HD-Map Asset Example](https://github.com/ASCS-eV/hd-map-asset-example)
- [Environment Asset Example](https://github.com/ASCS-eV/environment-model-asset-example)
- [Scenario Asset Example](https://github.com/ASCS-eV/scenario-asset-example)
- [OSI-Trace Asset Example](https://github.com/ASCS-eV/ositrace-asset-example/tree/main)

### 2. Pinata IPFS and CID Management

#### CID v1

- Assets uploaded via [Pinata](https://pinata.cloud/) MUST use [CID v1](https://docs.ipfs.tech/concepts/content-addressing/#version-1-v1).  
- This is achievable only through the API using the `pinataOptions` parameter, as outlined [here](https://docs.pinata.cloud/web3/pinning/pinata-metadata#pinataoptions).

#### File Naming

- Uploaded file names MUST exclude extensions (e.g., use `file` instead of `file.json`) to avoid issues such as double extensions during downloads (e.g., `file.json.json`).

### 3. Privacy Layer

The ENVITED-X Data Space implements a three-tiered privacy model:

| manifest:accessRole  | ENVITED-X Domain                                                      | Comment                               |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| `isOwner`            | <https://assets.envited-x.net/Asset-CID>                              | CID v1, signed URLs, asset credential |
| `isRegistered`       | <https://metadata.envited-x.net/Asset-CID>                            | CID v1, signed URLs, DEMIM credential |
| `isPublic`           | <ipfs://Data-CID> to <https://ipfs.envited-x.net/Asset-CID/Data-CID>  | CID v1, public, indexer to new URL    |

### 4. Asset Validation and Upload Process

#### Step 1: Client-Side Pre-Validation

- Drag and drop `asset.zip` into the upload field.
- Validate the `manifest_reference.json`:
  1. Ensure JSON structure matches the manifest SHACL constraints.
  2. Verify all referenced files exist locally or remotely as specified.
  3. Locate the `domainMetadata.json` file.
- Validate the `domainMetadata.json`:
  1. Extract SHACL constraints from the `domainMetadata.json` context.
  2. Validate JSON structure against domain-specific SHACLs.

#### Step 2: Upload Asset to ENVITED-X Data Space

- Trigger the upload process by clicking the "Upload" button.
- Calculate the CID of `asset.zip`.
- Rename `asset.zip` to `CID.zip` and store at `https://assets.envited-x.net/Asset-CID`.
- Store *registeredUser* metadata at `https://metadata.envited-x.net/Asset-CID`.
- Store *publicUser* metadata at `https://ipfs.envited-x.net/Asset-CID/Data-CID`.
- Calculate CIDs for all `isPublic` data.
- Create `tzip21_manifest.json` by replacing relative paths in `manifest_reference.json` with IPFS/envited-x.net URLs.
- Replace `@id` from `manifest_reference.json` with generated UUID in `tzip21_manifest.json`.
- Create `tzip21_token_metadata.json` and map metadata fields.

#### Step 3: Preview Data

- **TBD**: Define visualization and preview mechanisms for uploaded data.
- If a user triggers the "delete asset" button then all data stored in Step 2) is deleted.

#### Step 4: Mint Token

- Requirement: Use signed CIDs for the upload to Pinata according to EIP-712.
- Upload `isPublic` information and `tzip21_manifest.json` to IPFS.
- Verify that CIDs from Pinata returned the same CIDs then the pre-calculation.
- Upload `tzip21_token_metadata.json` to IPFS.
- Mint token with linked metadata.
- The wallet/SDK will provide feedback if a token was minted successfully.

#### Step 5: Listener and Database Synchronization

- Use a listener to detect mint events and synchronize data with the ENVITED-X database.
- Verify that data referenced in the token metadata is the same as stored in Step 2).
- If asset is not yet in DB then mark it as foreign asset and add the `publisher`information to the DB.
- Verify the asset in reverse order as in step 1).
- Only public information of assets can be verified if uploaded through another application then ENVITED-X.

### 5. Database Synchronization

#### CID as the Primary Identifier

- The CID of the uploaded `asset.zip` serves as the unique identifier connecting data across all systems.
- The CIDs MAY be signed by the user according to EIP-712.
- A UUID MUST be generated pre-mint to link the asset with the ENVITED-X database securely.
- The DID of the member associated with the user minting the asset MUST be known.

#### Pre-Mint Information

If additional non-public information needs to be stored in the database before minting, the CID can associate this data with the minted asset.

#### Synchronization and Security

The synchronization between the smart contract and the ENVITED-X database relies on:

1. The contract DID (current Ghostnet contract):  
   `did:tezos:NetXnHfVqm9iesp:KT1PCaD2kmgCHy15wQ1gpqZUy9RLxyBVJdTF`
2. Search `CID` of `tzip21_token_metadata.json` in database.
3. Compare if signature on CID is a `user` belonging to the `member` and if member is owner of token.
4. Check: Uniqueness of CID in database.

#### TZIP-21 rich metadata mapping

Attributes not in the table are static and the same for every mint.
Examples are the first five tags or "publishers", which is always ENVITED-X and the ASCS as the mint is conducted through the website.

| TZIP-21            | EVES-003                                             | Comment                                                      |
| -------------------| ---------------------------------------------------- | ------------------------------------------------------------ |
| "name"             | envited-x:DataResource:gx:name                       |                                                              |
| "description"      | envited-x:DataResource:gx:description                |                                                              |
| "tags"             | format:formatType + " " + format:version             | All tags static except for the format                        |
| "minter"           | Member DID associated with user initiating the mint  | Returned by the View from the DEMIM revocation registry      |
| "creators"         | Name of the company                                  | Taken from the company profile the user belongs to           |
| "date"             | [System date-time][1]                                |                                                              |
| "rights"           | "manifest:hasLicense:spdxIdentifier"                 | [SPDX identifier][2]                                         |
| "rightsUri"        | "manifest:hasLicense:licenseData:manifest:path"      | Full os license text URL OR policy smart contract did        |
| "artifactUri"      | <https://assets.envited-x.net/Asset-CID>             |                                                              |
| "identifier"       | Asset-CID                                            |                                                              |
| "externalUri"      | Uploaded domainMetadata.json to IPFS                 |                                                              |
| "displayUri"       | "manifest:hasArtifacts:Link" of category "isMedia"   | Always use the first media image                             |
| "formats"          | Add info for artifactUri, externalUri and displayUri |                                                              |
| "attributes"       | Same as in example with IPFS CIDs+URL                | For other asset types hdmap would be exchanged               |

**>Note:** Some of the information need to be extracted from the `gx:LegalParticipant`.

### Custom SPDX license identifier

- Custom license in a LICENSE file in the asset.zip root folder: "LicenseRef-Custom-Commercial-Agreement"
- Custom license in a smart contract as json-ld ODRL policy: "LicenseRef-Policy-Smart-Contract"

[1]: https://json-schema.org/understanding-json-schema/reference/string#dates-and-times
[2]: https://softwareengineering.stackexchange.com/a/450839/443441

## Backwards Compatibility

This specification introduces new processes for asset uploads and is fully compatible with existing ENVITED-X systems.
No retroactive changes to previous assets are required.

## Future Improvements

The compatibility with the current release of the [Gaia-X Policy Rules Compliance Document (Release 24.11)](https://docs.gaia-x.eu/policy-rules-committee/compliance-document/24.11/) is **to be implemented** in a future update of this EVES.

## References

1. [Gaia-X 4 PLC-AAD Manifest Ontology](https://github.com/ASCS-eV/ontology-management-base/tree/main/manifest)
2. [HD-Map Asset Example](https://github.com/ASCS-eV/hd-map-asset-example)
3. [Pinata Documentation](https://docs.pinata.cloud/web3/pinning/pinata-metadata#pinataoptions)
4. [RFC 2119: Key Words for Use in RFCs to Indicate Requirement Levels](https://datatracker.ietf.org/doc/html/rfc2119)
5. [Gaia-X Policy Rules Compliance Document (Release 24.11)](https://docs.gaia-x.eu/policy-rules-committee/compliance-document/24.11/)
6. [Reference Implementation](https://github.com/ASCS-eV/smart-contracts/tree/main/contracts/marketplace/)
7. [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
