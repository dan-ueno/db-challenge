# Project Architecture

This project follows the principles of Clean Architecture while maintaining the modular structure proposed by NestJS.

## Modules and Clean Architecture

Each module is responsible for managing a single resource, adhering to the Single Responsibility Principle (SRP) from the SOLID principles. NestJS architecture integrates clean architecture layers within each module, ensuring separation of concerns. Inside a module, you'll find:

- Presentation Layer (API): Exposes endpoints to handle requests (GraphQL resolvers or REST controllers).
- Domain Layer (Services/Use Cases): Contains the business logic of the application.
- Data Layer: Responsible for data persistence and access, found in the shared folder, as it's a global resource in this project.

## Graphql Module
The GraphQL module aggregates all resources that expose GraphQL APIs, with resolvers organized based on their respective domain identities.

## Rest Module
Similarly, the REST module contains the implementation of RESTful APIs. Currently, it only has a health checker controller, but its configuration serves as a foundation for future REST endpoints. Additionally, some services require at least one GET endpoint for health monitoring and availability purposes, like AWS services.