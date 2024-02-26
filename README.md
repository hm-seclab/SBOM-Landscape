# SBOM Landscape

This is a **Work in Progress** Project to implement an SBOM Landscape similar to the [Landscape of the Cloud Native Computing Foundation](https://landscape.cncf.io/). 

This project is part of the [SBOM Everywhere SIG](https://github.com/ossf/sbom-everywhere) at the OpenSSF and discussed in the [meetings](https://docs.google.com/document/d/193ODRga1F49WKPYYR79SNi9b27mChBqpOf5iiWJcMso/edit).

## How to contribute your tool
If you know of a tool or project that should be listed here, please open an Issue. There are three things to consider while adding a new tool:

### 1. Add a new entry
The /public/data.yaml contains all the information a user can search on the page. Just add a new entry to the list of tools. Please follow the following convention regarding the values. Please also refer to the tool's source, where the features are documented.

##### Name
The name of the tool as to be distinct in the list and is used as an identifier.

##### Publisher
The publisher refers to the company or institution that is maintaining the tool. It should be spelled similarly each time so users can find all tools from the same publisher.

##### Standards
A list of Standards a tool can produce. Currently, the three standards which are recognized by the [NTIA](https://www.ntia.gov/sites/default/files/publications/sbom_formats_survey-version-2021_0.pdf) are supported:
- SPDX
- CycloneDx
- SWID

##### Abilities
Abilities describe the capabilities of the tool. In what part of the software development lifecycle can the tool be used? The following abilities are supported:
- Generate
- Convert
- Edit
- Consume

##### Type
SBOMs may contain different forms of the minimum information sourced from different
product artifacts. The following types are supported as published by the [NTIA](https://www.cisa.gov/resources-tools/resources/types-software-bill-materials-sbom). Because many tools specifically support the scanning of container images, the category *Container* is added additionally. Even if container scans can be considered *Analyzed*:
- Design
- Source
- Build
- Analyzed
- Deployed
- Runtime
- Container

### 2. Add a description
You can add a detailed description to the /public/descriptions folder. The description should be written in markdown and named after the tool (Same name as in the data.yaml). The description should contain detailed information about the tools and features claimed in the data section. Feel free to add links to the GitHub repository or supplier.

### 3. Add a logo
You can add a logo to the /public/logos folder. The logo should be named after the tool (Same name as in the data.yaml). The logo should be a PNG file with a transparent background. The logo should be 200px x 200px.

The logo will be displayed on the page in the Map-view, in the List-view and in the details- section. You add Logos for all categories. Also for the Publisher.

If you add a Logo, we assume your project and company are OK with that. The logo should be used under the fair use policy. If you want to remove your logo, please open an issue.
