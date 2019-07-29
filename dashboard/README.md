# Consensys Project Course spring 2019 - uPort extension 

This projects is intended to be an extensiotn of [uPort](https://www.uport.me). Citing their site: uPort returns ownership of identity to the individual. uPort's open identity system allows users to register their own identity on Ethereum, send and request credentials, sign transactions, and securely manage keys & data.

What I'm adding to their open identity system are:

- Delegates managment without using a traditional multi sig smart contract, like uPort does.
- Credentials managment, revoke and check credential status.

## General Concept to know

Here when I talk about Credential I'm talking about Verifiable Credential, which is a standard proposed by [W3C](https://www.w3.org/TR/verifiable-claims-data-model/). 

In the physical world, a credential might consist of:

- Information related to the subject of the credential (for example, a photo, name, and identification number)
- Information related to the issuing authority (for example, a city government, national agency, or certification body)
- Information related to the specific attribute(s) or properties being asserted by issuing authority about the subject
- Evidence related to how the credential was derived
- Information related to expiration dates.

A verifiable credential can represent all of the same information that a physical credential represents. The addition of technologies, such as digital signatures, makes verifiable credentials more tamper-evident and more trustworthy than their physical counterparts. 

The key actors in an open identity systems are:

- User: the owner of some Verifiable Credentials, a student.
- Issuer: the entity issuing one or more Verifiable Credentials, a University.
- Verifier: one who only reads a Verifiable Credential and makes sure he trusts the issuer, an employer.

Each one of this actor, in order to access the open identity system needs an identifier, which is always standardised by the W3C, and it is called [DID](https://w3c-ccg.github.io/did-spec/#did-documents) Decentralized Identifier

W3C proposed a new standard for objects addressing which lives under the control of nobody, leveraging distributed ledger technologies. 
Each ledger that is compliant with DID standards has an associated DID "method" - a set of rules that govern how DIDs are anchored onto a ledger. Uport for example supports did:ethr and others. My method is called did:pistis

Every DID points to a DID Document which is the serialization of the data associated with that DID. The main data to be shown in a DID Document are the public keys with certain privileges over that DID they are associated with. These public keys are the delegates who can complete action, based on the priviliges that they have, on behald of the DID to which the DID Document points to. This can happen  when the identity is an institution or a company, or when someone lose his private key and with the help of a delegates can reaquire the control of his identity. 
An identity starts with no delegates, and the only working address is the identity itself, which can act without any control. As soon as the identity add a delegates with a certain permission, then to complete any operation that requires that kind of permission this has to be confirmed by another delegates. This is to avoid that one of the delegates can steal the someone else identity. Confirmation is never required to sign on behalf of the identity. 

The project which I'm delivering for the Consensys Course is not the complete project but just a part of it. More precisely it is just the two additions on top of the uPort open identity system stated before. It lacks all the other parts like the Verifiable Credential sharing, issuing and verification process. 

## User Stories

An University wants to integrate their systems with this dashboard in order to start realising Diploma Degree as Verifiable Credentials. They want their Verifiable Credentials to be signed by a unique DID, but at the same time they want to track which University employer is delivering each Verifiable Credential. Hence, they need a way to let their authorized employers sign verifiable credential on the behalf of the University.
So an University employer, possibly the University rector create a new Ethereum account which will be the University DID. Then it sets this identity into the dashboard. When he opens the dashboard for the first time it will have a single identity authorized to act on behalf of the univesity which is the DID of the university set before. 
Now, in the Delegates Management page he can see the delegates with their permissions and add or revoke new delegates and watch the list of delegates being updated. As soon as he have two delegates, in order to add or revoke any delegate he will need the confirmation of the another delegate, this is to avoid that someone can become the unique owner of the University DID. 
If the employer has the permission for the Credential Status Management, in the Credential Management page can see the list of credentials issued by the University and check or change their status. If there is more than one delegates with the Credential Status Mangement permission, then the minimum quorum to change the status of a credential is 2, hence one og the other delegates need to confirm the operation.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine testing purposes. 
We dockerized the client and the server as encouraged by the project instructions so it should be straightforward for you guys to have it running.

### Prerequisites

- Docker, you can install it [here](https://www.docker.com/get-started)
- Metamask extension, you can download it [here](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=it)

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

Pull the docker images from Docker Hub:

```
docker run --detach -e ADDRESS="0x85FD638BD834Fa28FFa70bf29c6BF8585aE7d6a5" -e PRIVATEKEY="f5d0ead35c21a2b945be8577cd19e13080fe1cf1769012d9c76c4f7c09e68f92" andreataglia/ssi-consensys-backend:0.3
```



And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```


## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
