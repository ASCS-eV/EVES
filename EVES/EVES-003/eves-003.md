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
It leverages existing specifications, such as the Gaia-X Trust Framework, the Gaia-X 4 PLC-AAD Ontologies, and implements privacy layers, validation, and metadata mapping aligned with [Tezos TZIP-21](https://docs.tezos.com/architecture/governance/improvement-process#tzip-21-rich-contract-metadata).

## Motivation

Standardizing the definition and upload process for digital assets `SimulationAssets` in the ENVITED-X Data Space ensures:

- Interoperability with existing Gaia-X data spaces.
- Security through CID-based identification and metadata validation.
- Scalability for integrating diverse asset types.

This EVES addresses the need for clear guidelines to onboard assets and synchronize data with ENVITED-X systems.

## Specification

### 1. Digital Asset Definition

The `envited-x:SimulationAsset` defines a digital asset within the domain of simulation including the core simulation data and all necessary files for describing, evaluating, and visualizing the dataset.
All simulation assets MUST be derived from a common `envited-x` ontology defined in the [Gaia-X 4 PLC-AAD Ontology Management Base][1].
A data space portal SHALL display the currently supported version of the ontologies like e.g.: `https://ontologies.envited-x.net/envited-x/v2/ontology#`.
Each simulation asset SHALL be compliant with the [Gaia-X Ontology and SHACL shapes 2210][2].
The `gx` turtle shacle shapes are derived from the [Gaia-X Trust Framework Schema][3] and the respective application/ld+json [Gaia-X Trust Framework Shapes][4].
A [GaiaX Compliant Claims Example][5] MAY be generated using the [GaiaX 4 PLC-AAD Claim Compliance Provider][6].

The example implementation in the 📁 `example/` folder is based on release v0.2.3 of the [ASCS HD-Map Asset Example][7].

Asset examples can be found in the following repositories:

- [HD-Map Asset Example](https://github.com/ASCS-eV/hd-map-asset-example)
- [Environment Asset Example](https://github.com/ASCS-eV/environment-model-asset-example)
- [Scenario Asset Example](https://github.com/ASCS-eV/scenario-asset-example)
- [OSI-Trace Asset Example](https://github.com/ASCS-eV/ositrace-asset-example/tree/main)

### 2. Pinata IPFS and CID Management

It is RECOMMENDED to use [IPFS][8] within the ENVITED-X Data Space for making public data available.
IPFS is a peer-to-peer content delivery network built around the innovation of content addressing: store, retrieve, and locate data based on the fingerprint of its actual content rather than its name or location.

#### CID v1

Artifacts uploaded to IPFS e.g. using services like [Pinata][9] MUST use the content identifier version [CID v1][11].  
In Pinata this is achievable through the API using the `pinataOptions` parameter, as outlined in the [documentation][10].

#### File Naming

Uploaded file names MUST exclude extensions (e.g., use `file` instead of `file.json`) to avoid issues such as double extensions during downloads (e.g., `file.json.json`).

### 3. Privacy Layer

The ENVITED-X Data Space implements a three-tiered privacy model:

| envited-x:accessRole | ENVITED-X Domain                                                      | Comment                               |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| `isOwner`            | <https://assets.envited-x.net/Asset-CID>                              | CID v1, signed URLs, asset credential |
| `isRegistered`       | <https://metadata.envited-x.net/Asset-CID>                            | CID v1, signed URLs, DEMIM credential |
| `isPublic`           | <ipfs://Data-CID> to <https://ipfs.envited-x.net/Asset-CID/Data-CID>  | CID v1, public, indexer to new URL    |

### 4. Asset Validation and Upload Process

The following process is implemented in the [ENVITED-X Data Space][12] portal developed by the Automotive Solution Center for Simulation e.V.

#### Step 1: Client-Side Pre-Validation

- Drag and drop `asset.zip` into the upload field.
- Validate the `manifest_reference.json`:
  1. Ensure JSON structure matches the manifest SHACL constraints.
  2. Verify all referenced files exist locally or remotely as specified.
  3. Locate the `domainMetadata.json` file.
- Validate the `domainMetadata.json`:
  1. Extract SHACL constraints from the `domainMetadata.json` context,
  2. Validate JSON structure against domain-specific SHACLs,
  3. Check if the `@id` is unique within the ENVITED-X Data Space,
  4. If the asset `@id` is already existing the validator SHALL throw an error.
- Validate if items in `hasReferencedArtifacts` are available:
  1. Check if `@id` of asset is known in the database,
  2. OPTIONALLY check if filePath resolves if the access role is `isPublic`,
  3. It is RECOMMENDED to warn the user if references do not exist,
  4. It is strongly RECOMMENDED to add the `CID` as a user to the Manifest metadata.

#### Step 2: Upload Asset to ENVITED-X Data Space

- Trigger the upload process by clicking the "Upload" button.
- Calculate the CID of `asset.zip`.
- Rename `asset.zip` to `CID.zip` and store at `https://assets.envited-x.net/Asset-CID`.
- Store `isRegistered` metadata at `https://metadata.envited-x.net/Asset-CID`.
- Store `isPublic` metadata at `https://ipfs.envited-x.net/Asset-CID/Data-CID`.
- Calculate CIDs for all `isPublic` data.
- Create `envited-x_manifest.json` by replacing relative paths in `manifest_reference.json` with IPFS/envited-x.net URLs.
- Replace the paths of items in `hasReferencedArtifacts` to the correct filePaths.
- Replace `@id` from `manifest_reference.json` with generated database `UUID` in `envited-x_manifest.json`. This also applies for referenced artifacts.
- Create `tzip21_token_metadata.json` and map the metadata fields OPTIONALLY use an application/ld+json conform to the [tzip21 ontology][19].

#### Step 3: Preview Data

- **TBD**: Define visualization and preview mechanisms for uploaded data.
- If a user triggers the "delete asset" button then all data stored in Step 2) is deleted.

#### Step 4: Mint Token

- It is RECOMMENDED to use signed CIDs for the upload to IPFS according to [EIP-712][13].
- Upload `isPublic` information and `envited-x_manifest.json` to IPFS.
- It is RECOMMENDED to verify that CIDs from the IPFS service or software returns the same CIDs as the pre-calculation.
- Upload `tzip21_token_metadata.json` to IPFS.
- Mint token with linked metadata.
- The wallet/SDK will provide feedback if a token was minted successfully.

#### Step 5: Listener and Database Synchronization

- Use a listener to detect mint events and synchronize data with the ENVITED-X Data Space portal database.
- A data space like the ENVITED-X Data Space MUST check if the asset was uploaded through its respective portal:
  - `UUID` from step 2) has an entry in the database.
  - Confirm that `contract` + `CID` and `minter` of tzip21_token_metadata.json are the same as in the database.
  - Confirm that the entries `UUID` and `@id` of the asset are unique.
  - OPTIONALLY check if the EIP-712 signature of the tzip21_token_metadata.json matches the user who initiated the mint (SHALL only be known to the respective portal).
- If the asset is not yet in DB OPTIONALLY mark it as foreign asset and add the `publisher` information to the DB.
- It is RECOMMENDED to verify the asset in reverse order as in step 1).
- Only public information of assets can be verified if uploaded through another portal than ENVITED-X data space.

### 5. Database Synchronization

#### @id and CID as the Primary Identifier

- The CID of the uploaded `asset.zip` serves as the unique identifier detecting identical datasets across all systems.
- In addition the unique identifier `@id` of the `envied-x:SimulationAsset` in the `domainMetadata.json` SHALL be used for identification of the digital assets.
- The CIDs MAY be signed by the user according to EIP-712.
- A UUID MUST be generated for the `envited-x_manifest.json` pre-mint to link the asset with the ENVITED-X database securely.
- The DID of the member associated with the user minting the asset MUST be known.
- DID of the user minting the asset SHALL be stored pre-mint in the database.

#### Pre-Mint Information

If additional non-public information needs to be stored in the database before minting, the CID can associate this data with the minted asset.

#### Synchronization and Security

[EVES-007](../EVES-007/eves-007.md) defines the ENVITED-X Blockchain Identifier URN Schema.
The synchronization between the smart contract as in the [Marketplace Contract Reference Implementation][18] and the ENVITED-X database relies on:

1. The contract identifier on Tezos (current Ghostnet contract):  
   `urn:blockchain:tezos:NetXnHfVqm9iesp:contract:KT1PCaD2kmgCHy15wQ1gpqZUy9RLxyBVJdTF`
2. Search `CID` of `tzip21_token_metadata.json` and the complete `asset.zip` in database.
3. Compare if signature on CID is a `user` belonging to the `member` and if member is owner of token.
4. Check: Uniqueness of CID in database.

### TZIP-21 Token Metadata

#### TZIP-21 Rich Metadata Mapping

Attributes not in the table are static and the same for every mint as in the 📁 `example/tzip21_token_metadata.json`.
Examples are the first five tags or "publishers", which is always ENVITED-X and the ASCS if the mint is conducted through the [website][12].

| TZIP-21            | EVES-003                                                 | Comment                                                                    |
| -------------------| -------------------------------------------------------- | -------------------------------------------------------------------------- |
| "name"             | envited-x:DataResource:gx:name                           |                                                                            |
| "description"      | envited-x:DataResource:gx:description                    |                                                                            |
| "tags"             | $TAG = format:formatType + " " + format:version          | "tags": ["GaiaX","ASCS","ENVITED-X","EVES","nft", "$TAG"]                  |
| "minter"           | Member DID (CAIP-10) associated with user                | Returned by the View from the DEMIM revocation registry                    |
| "creators"         | Name of the company                                      | Taken from the company profile the user belongs to                         |
| "date"             | [System date-time][14]                                   |                                                                            |
| "rights"           | manifest:hasLicense:gx:license                           | [SPDX identifier][15]                                                      |
| "rightsUri"        | manifest:hasLicense:licenseData:hasFileMetadata:filePath | Full os license text URL OR policy smart contract did                      |
| "artifactUri"      | <https://assets.envited-x.net/Asset-CID>                 |                                                                            |
| "identifier"       | Simulation Asset @id                                     | Unique identifier from the domainMetadata.json                             |
| "externalUri"      | Uploaded domainMetadata.json to IPFS                     |                                                                            |
| "displayUri"       | "manifest:hasArtifacts:Link" of category "isMedia"       | Always use the first media image                                           |
| "formats"          | artifactUri, externalUri, displayUri, envited-x_manifest |                                                                            |
| "attributes"       | Reverse domain notation for ontologies + URL             | All ontologies from top level nodes in files referenced in formats section |

**>Note:** Some of the information need to be extracted from the `gx:LegalParticipant`.

#### Custom SPDX license identifier

- Custom license in a LICENSE file in the asset.zip root folder: "LicenseRef-Custom-Commercial-Agreement"
- Custom license in a smart contract as json-ld ODRL policy: "LicenseRef-Policy-Smart-Contract"

## Backwards Compatibility

This specification introduces new processes for asset uploads and is fully compatible with existing ENVITED-X systems.
No retroactive changes to previous assets are required.

## Future Improvements

The compatibility with the current release of the [Gaia-X Policy Rules Compliance Document (Release 24.11)][17] is **to be implemented** in a future update of this EVES.

## References

- [Gaia-X 4 PLC-AAD Ontology Management Base][1]
- [Gaia-X Ontology and SHACL shapes 2210][2]
- [Gaia-X Trust Framework Schema][3]
- [Gaia-X Trust Framework Shapes][4]
- [GaiaX Compliant Claims Example][5]
- [GaiaX 4 PLC-AAD Claim Compliance Provider][6]
- [ASCS HD-Map Asset Example][7]
- [IPFS][8]
- [Pinata Documentation][10]
- [ENVITED-X Data Space Portal][12]
- [EIP-712][13]
- [RFC 2119: Key Words for Use in RFCs to Indicate Requirement Levels][16]
- [Gaia-X Policy Rules Compliance Document (Release 24.11)][17]
- [Marketplace Contract Reference Implementation][18]

[1]: https://github.com/ASCS-eV/ontology-management-base/
[2]: https://github.com/GAIA-X4PLC-AAD/ontology-management-base/tree/main/gx
[3]: https://registry.lab.gaia-x.eu/v1/api/trusted-schemas-registry/v2/schemas/gax-trust-framework
[4]: https://registry.lab.gaia-x.eu/v1/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#
[5]: https://github.com/GAIA-X4PLC-AAD/gaia-x-compliant-claims-example
[6]: https://github.com/GAIA-X4PLC-AAD/claim-compliance-provider
[7]: https://github.com/ASCS-eV/hd-map-asset-example/releases/tag/v0.2.3
[8]: https://ipfs.tech/
[9]: https://pinata.cloud/
[10]: https://docs.pinata.cloud/web3/pinning/pinata-metadata#pinataoptions
[11]: https://docs.ipfs.tech/concepts/content-addressing/#version-1-v1
[12]: https://envited-x.net/
[13]: https://eips.ethereum.org/EIPS/eip-712
[14]: https://json-schema.org/understanding-json-schema/reference/string#dates-and-times
[15]: https://softwareengineering.stackexchange.com/a/450839/443441
[16]: https://datatracker.ietf.org/doc/html/rfc2119
[17]: https://docs.gaia-x.eu/policy-rules-committee/compliance-document/24.11/
[18]: https://github.com/ASCS-eV/smart-contracts/tree/main/contracts/marketplace/
[19]: https://github.com/GAIA-X4PLC-AAD/ontology-management-base/tree/main/tzip21
