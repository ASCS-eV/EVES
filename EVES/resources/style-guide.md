# EVES Style Guide

This style guide outlines the formatting, structure, and writing standards for all ENVITED Ecosystem Specifications (EVES) and related resources in the repository. Following this guide ensures consistency, readability, and professionalism across the repository.

## General

The key words **"MUST"**, **"MUST NOT"**, **"REQUIRED"**, **"SHALL"**, **"SHALL NOT"**, **"SHOULD"**, **"SHOULD NOT"**, **"RECOMMENDED"**, **"MAY"**, and **"OPTIONAL"** in this document are to be interpreted as described in [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).

Use these terms only when their meaning aligns with the definitions in RFC 2119 to ensure clarity and precision.

## General Writing Guidelines

1. **Clarity**: Write clearly and concisely. Avoid overly technical jargon unless necessary.
2. **Neutral Tone**: Use a neutral, objective tone that is free from personal opinions.
3. **Active Voice**: Use active voice wherever possible to make the content direct and engaging.
4. **Inclusive Language**: Use gender-neutral and inclusive language.
5. **Consistency**: Maintain consistency in terminology, formatting, and style throughout the document.

## Document Structure

All EVES must adhere to the following structure, as defined in EVES-001:

1. **Header**:  
   Use the YAML header format for metadata, with these required fields:

   ```yaml
   ---
   eves-identifier: 00X
   title: Name describing the EVES
   author: Name (@GitHub user)
   discussions-to: https://github.com/ASCS-eV/EVES/issues/
   status: [Draft/Final/Other]
   type: [Process/Standards/Informational]
   created: YYYY-MM-DD
   requires: [List of EVES this depends on, e.g., "EVES-001"]
   replaces: None
   ---
   ```
