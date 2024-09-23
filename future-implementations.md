# Future Implementations

This section outlines ideas for future implementations, improvements, and justifications for the current state of the project.

## Architecture

For future implementations involving the architecture, several steps can be taken to ensure the project develops in a healthy and well-organized manner:

- **Testing Module Separation**: Implementing a dedicated testing module can reduce redundancy when writing future tests. Utilities for making requests, modularized testing services, checking values (expects), and seed management are some examples that could streamline testing.
- **Centralized Server Messages**: Having a centralized file to manage messages sent across the server can improve maintenance and provide easier access for comparison or updates.
- **Standardized GraphQL Error Handling**: Since NestJS doesn't provide custom error handling for GraphQL, implementing an error formatting algorithm and adding it to the `graphql-config` could enhance the error management experience for consumers of the service.

- **Authentication Interceptors Creation**: (\*)

(\*)  
Currently, a context was implemented to simply pass key-value pairs from the headers, retrieving `accountId` and `agentId` directly. This separation allows for future implementations to replace these authentication parameters with `authorization` without significant refactoring. If these parameters had been sent through query/mutation variables, it would increase future maintenance efforts and violate the **Single Responsibility Principle (SRP)**, which dictates that input variables should only relate to the business logic, not include implementation details such as authentication data.

## Business Logic

For future business logic implementations, the most impactful task would be creating authentication routes, possibly with a `user` database table to manage roles such as `account` and `agent`, thus normalizing the identification flow and user management. This would also increase security.

Regarding task and schedule management, future implementations could involve more business rules, such as locking certain dates for creating and editing tasks or schedules, and including names and descriptions for each task and schedule. Another rule might prevent assigning a task to the same account in overlapping periods.

It's worth noting that these more complex rules would benefit from being created within use-cases and tested with integrated tests, ensuring code quality and adherence to clean code and clean architecture principles.
