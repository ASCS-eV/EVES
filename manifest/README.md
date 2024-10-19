# SHACL Shapes and Ontology for the Manifest

This folder contains the SHACL shapes and ontology definitions for validating manifest data structures. The shapes are defined in Turtle syntax and use various namespaces.

## Namespaces

- `dcterms`: <http://purl.org/dc/terms/>
- `gax-core`: <https://w3id.org/gaia-x/core#>
- `manifest`: <https://github.com/ASCS-eV/EVES/tree/onboarding/ontologyManifest/>
- `owl`: <http://www.w3.org/2002/07/owl#>
- `rdfs`: <http://www.w3.org/2000/01/rdf-schema#>
- `xsd`: <http://www.w3.org/2001/XMLSchema#>
- `gx`: <https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#>

## Ontology Definition

The ontology defines the structure and relationships of the manifest data.

```turtle
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix gax-core: <https://w3id.org/gaia-x/core#> .
@prefix manifest: <https://github.com/ASCS-eV/EVES/tree/onboarding/ontologyManifest/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix gx: <https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#> .

manifest: a owl:Ontology ;
    rdfs:label "ontology definition for manifest"@en ;
    dcterms:contributor "Johannes Demer (ASCS)" ;
    owl:versionInfo "0.1" .

manifest:Manifest a owl:Class ;
    rdfs:label "class definition for manifest" ;
    rdfs:comment "manifest attributes for all assets"@en ;
    rdfs:subClassOf gx:DataResource .
```

## SHACL Shapes

### ManifestShape

The `ManifestShape` defines the structure of a manifest. It contains one property:

- **data**: References `DataShape` and must be present exactly once.

```turtle
manifest:ManifestShape a sh:NodeShape ;
    sh:property             
        [ sh:maxCount 1 ;
            sh:minCount 1 ;
            sh:node manifest:DataShape ;
            sh:order 1 ;
            sh:path manifest:data ];         
    sh:targetClass manifest:Manifest .
```

### DataShape

The `DataShape` defines the structure of the links within a manifest. It contains several properties:

- **contentData**: Optional reference to content data as a relative path.
- **assetData**: Required reference to assetdata as a relative path.
- **asset**: Required reference to the asset.zip folder as a relative path.

```turtle
manifest:DataShape a sh:NodeShape ;
    sh:property 
        [   skos:example "link to zipped asset folder, e.g. ./asset.zip" ;
            sh:description "Reference to the asset folder as relativePath"@en ;
            sh:message "Validation of asset failed!"@en ;
            sh:minCount 1 ;
            sh:maxCount 1 ;
            sh:name "asset"@en ;
            sh:node manifest:LinkShape ;
            sh:order 1 ;
            sh:path manifest:asset 
        ],

        [   skos:example "link to valuable data, e.g. ./hdmap.xodr" ;
            sh:description "Reference to valuable data/asset as relativePath or link"@en ;
            sh:message "Validation of data failed!"@en ;
            sh:minCount 1 ;
            sh:name "assetData"@en ;
            sh:node manifest:LinkShape ;
            sh:order 2 ;
            sh:path manifest:assetData
        ],
       [    skos:example "screenshot, video, routing, 3d preview" ;
            sh:description "Reference to media data as relativePath"@en ;
            sh:message "Validation of media failed!"@en ;
            sh:name "contentData"@en ;
            sh:node manifest:LinkShape ;
            sh:order 3 ;
            sh:path manifest:contentData 
        ];

    sh:targetClass manifest:Data .
```

### LinkShape

The `LinkShape` defines the structure of a single link. It contains several properties:

- **accessRole**: Required specification of the access role (owner, registeredUser, publicUser).
- **format**: Optional format of the link (pdf, png, mp4, geojson, zip, json, txt, xodr).
- **type**: Required type of the link (Document, Image, Model, Routing, Video, 3DPreview, Asset, Metadata, License, Validation, Data).
- **relativePath**: Required relative path of the link.

```turtle
manifest:LinkShape a sh:NodeShape ;
    sh:property [ sh:datatype xsd:string ;
                  sh:in ("owner" "registeredUser" "publicUser") ;
                  sh:message "Validation of accessRole failed!"@en ;
                  sh:description "Choose an accessRole." ;
                  sh:name "accessRole"@en ;
                  sh:order 3 ;
                  sh:maxCount 1 ;
                  sh:minCount 1 ;
                  sh:path manifest:accessRole ],
                [ sh:dataformat xsd:string ;
                  sh:in ("pdf" "png" "mp4" "geojson" "zip" "json" "txt" "xodr") ;
                  sh:message "Validation of format failed!"@en ;
                  sh:description "Choose format of link." ;
                  sh:name "format"@en ;
                  sh:order 2 ;
                  sh:maxCount 1 ;
                  sh:path manifest:format ],
                [ sh:datatype xsd:string ;
                  sh:in ("Document" "Image" "Model" "Routing" "Video" "3DPreview" "Asset" "Metadata" "License" "Validation" "Data") ;
                  sh:message "Validation of type failed!"@en ;
                  sh:description "Choose type of link." ;
                  sh:name "type"@en ;
                  sh:order 1 ;
                  sh:maxCount 1 ;
                  sh:minCount 1 ;
                  sh:path manifest:type ],
                [ sh:datatype xsd:anyURI ;
                  sh:message "Validation of relative path failed!"@en ;
                  sh:description "Enter link as relative path." ;
                  sh:name "relativePath"@en ;
                  sh:order 0 ;
                  sh:maxCount 1 ;
                  sh:minCount 1 ;
                  sh:path manifest:relativePath ] ;
    sh:targetClass manifest:Link .
```

## FAQ: 
### How can I easily create a manifest file?
- **Preparation :** *Ensure you have the [SHACL file](https://github.com/ASCS-eV/EVES/tree/onboarding/ontologyManifest/) downloaded. The provided SHACL file defines the structure and constraints for the manifest.*

- **Access the Web Tool :** *Open the [SD Creation Wizard](https://sd-creation-wizard.gxfs.gx4fm.org/select-file) in your web browser.* 

- **Upload the SHACL File :** *Click the button to upload your SHACL file. The tool will analyze the file and extract the relevant information.*

- **Configuration :** *After uploading, you may be prompted to enter additional information or configurations. This could include specifying contexts, IDs, or other metadata.* 

- **Generate Manifest :** *The tool will generate a manifest file based on the provided SHACL file and your input. Review the generated data and make any necessary adjustments.*

- **Download :** *Once you are satisfied with the generated manifest, you can download it and use it for your repo description.*

### Which roles can I define for access management?

- **owner** *: The owner has full access to the asset and its associated files. This role includes permissions to download the asset.*

- **registeredUser** *: A registered user has access to certain files and data within the asset but can't download the asset.*


- **publicUser** *: A public user has only viewing rights to certain files or metadata.*

