## Project description: 
ThingsBoard is an open-source Internet of Things (IoT) platform that provides infrastructure for data collection, processing, visualization, and management of devices and assets.
This project automates tests of business flows within the ThingsBoard application, using Playwright with javascript.

## Project
Testing ThingsBoard device management (create, assign, delete devices)

## Setup
1- ThingsBoard git: https://github.com/thingsboard/thingsboard
2- Instructions on how to setup ThingsBoard locally: https://thingsboard.io/docs/user-guide/install/docker-windows/?ubuntuThingsboardQueue=inmemory

## Notes
1- Tests use Playwright API & UI
2- Custom waits implemented to handle async table updates
3- Tenant credentials: tenant@thingsboard.org / tenant credentials
4- ThingsBoard local instance hosted on http://localhost:8080
5- Test Plan and Bug Reports can be found inside /Additional Resources 
