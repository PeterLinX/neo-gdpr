# GDPR on NEO
This repo is the submission of the 'G-Team' during the NEO hackathon in Rotterdam/Delft on 20-21/10/2018.

## Concept
The goal of this application is to allow users to subscribe or unsubscribe to/from a mailing list, and have it guaranteed by the blockchain. Each user's data is encrypted with a user-specific key, which is then hashed. These hashes are then stored on IPFS. The Hash for this IPFS is stored on the blockchain for a specific mailing list. At any given point in time, the smart contract returns the hash . Because the user knows his own email address and encryption key, he can encrypt and then hash his email address and validate wether or not this hash is still present on IPFS. If it is not present, but he is still getting commercial information from the company, that shows the company is not respecting his unsubscribe-request, and the user can proof he had requested this. We believe this encourages companies to comply, as it will be obvious when they don't, and will make users more willing to subscribe and sheir their information, as they can rely on the blockchain to proof in case a company should be non-compliant.

## Components
### Application
The application serves as a POC to demonstrate the concept. It runs in NodeJS to serve a frontend, and makes use of Firebase on Google Cloud Platform to store its data.

### Smart Contract
The smart contract has 2 operations. The `update` operation takes 2 parameters, the id of the newsletter, and the IPFS hash to store. At this hash, the hashes of the encrypted email addresses that are subscribed can be found.
The `list` operation takes as a paramter the id of the newletter, and returns the IPFS Hash where the encrypted hashes of the email subscribes can be found.

## Slidedeck
https://docs.google.com/presentation/d/1OD9rJ45ubc6XLhJ0F02GwMAI1FGSOBQa6gdxHNUIH1k/preview
