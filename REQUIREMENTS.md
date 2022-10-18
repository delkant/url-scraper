# Vizion API Challenge

:wave: Hi there!

In this project, you'll build a simple API that fetches some info about a given URL/webpage and makes the results accessible. This project aims to see how you approach a given problem & set of requirements with little constraint on how to approach it and convey information to your peers.

- [Setting Up](#setting-up)
- [Requirements](#requirements)
- [Bonus Points](#bonus-points)
- [Submitting Your Work](#submitting-your-work)

## Setting Up

To get started, make sure you have Node.js installed. We recommend the [active LTS release](https://nodejs.org/en/about/releases/). 

Afterward, clone or download this repository locally (please don't fork). This project contains an empty `index.js` file; you're free to begin working there. If you have another approach in mind, delete this file.

FYI, our product stack is mostly using TypeScript running on Node.js. We use PostgreSQL for our primary database. **How you decide to tackle this project is entirely up to you, but keep these details in mind as you build. Submitting your solution using TypeScript is highly recommended.**

## Requirements

Complete the following:

- [Create a New Reference](#1-create-a-new-reference)
- [Process the New Reference](#2-process-the-new-reference)
- [Make the Results Accessible](#3-make-the-results-accessible)
- [Write a Setup Guide](#write-a-setup-guide)

## Develop a [RESTful](https://restfulapi.net/) API 

#### 1. Create a New Reference

- Add an endpoint that accepts a URL in the request body and create and return a new [`Reference`](#reference) record as JSON.
- During this process, you should also initiate an asynchronous task to fetch data from the URL saved in the [`Reference`](#reference). 
  - [More information on fetching data is below](#data-fetching-notes).
- **Note:** The endpoint should return the [`Reference`](#reference) record without waiting for it to be processed.

#### 2. Process the New Reference

- Implement an async worker function that processes the reference. 
  - This function should take a [`Reference`](#reference) as an argument.
- Given the [`Reference`](#reference) `url` field, get the text content from the page's `title` and any `meta` elements (if they exist) with their names and values serialized to create a semi-structured representation of a page's title & metadata.
- Return the data as an object and create a new [`Result`](#result) record in the database, storing the info as JSON or a serialized string into the record's `data` column.

#### 3. Make the Results Accessible

- Add a new GET endpoint that allows a user to fetch results for a given [`Reference`](#reference) ID. 
  - This endpoint should return a list of saved [`Results`](#result) for a given [`Reference`](#reference) as JSON. 
- Don't forget to keep it RESTful and keep [resource naming best practices](https://restfulapi.net/resource-naming/) in mind as you go.

#### Data Fetching Notes

In your processing task, you'll need to fetch the contents of a webpage and extract information from its DOM. To do this, we recommend fetching and working with the page content using browser automation tools like [Puppeteer](https://github.com/puppeteer/puppeteer) or [Playwright](https://playwright.dev/).

> :warning: BEWARE! :warning:

Fetching HTML via HTTP and being able to extract your information without any additional effort is becoming increasingly less common these days with the rise of JS-dependent rendering, SPAs, and other complexities like bot detection or browser fingerprinting. If you'd like to challenge yourself a bit further, check out [ToScrape](https://toscrape.com), which has many great scenarios already laid out and designed for extracting!

### Data Models

#### Reference

A reference is created when a user makes a call to `POST /references`

| Field        | Type        | Description              |
| ------------ | ----------- | ------------------------ |
| `id`         | primary key | the reference identifier |
| `url`        | string      | a valid web address      |
| `created_at` | timestamp   | reference created time   |

#### Result

A result is created after a data fetching task for a `Reference` is completed.

| Field          | Type        | Description                   |
| -------------- | ----------- | ----------------------------- |
| `id`           | primary key | the reference identifier      |
| `reference_id` | foreign key | the related reference         |
| `data`         | json        | Result from the fetching task |
| `created_at`   | timestamp   | result created time           |

## Write a Setup Guide

Document instructions for getting your solution up and running. Your project will be run, tested, and assessed using your instructions—assume no dependencies will be pre-installed other than Docker and Node.

## Bonus Points

Other things that are not required, but we would love to see:

- Test coverage (We tend to use [Jest](https://jestjs.io/))
- Additional validations
- More endpoints (fetch all references, delete a reference & its results, etc.)
- Make use of an actual job queue (Redis, ElasticMQ, etc.)
- Scheduling/interval-based reprocessing of existing references to monitor changes
- Anything else you can think of!

Suppose you don't implement bonus items, no worries. Feel free to share some notes of things you might do and how you might have gone about them given more time.

## Submitting Your Work

> **:bangbang: Commit your changes to the main branch before submitting :bangbang:**

When you have finished the exercise, please create a bundle of your work: 

1. Change to the project root
1. Run `npm run bundle`
    - This will create a bundle file called `take-home-challenge.bundle` based on your local main branch. 
1. Send the file to us via email, or if you received a submission link from your hiring manager, please upload it there.

Thank you, and good luck! :pray:
