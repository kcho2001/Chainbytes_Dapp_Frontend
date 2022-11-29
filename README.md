# Chainbytes_Dapp_Frontend
This mobile application is made to utilize blockchain technology in order to have transactions of checking in/paying workers to be immutable and verified. 

<br>

## Roles
This application is broken up into 3 different roles with different functions:
- Farmer role: Farmers can only be determined by whoever owns the contract. This role is stored into the contract, and allows access to the farm_app, and its functions. Farmer functions: createForeman, batchPay.
    * createForeman: allows the farmer to send an address to the contract, whose role will change to a foreman.
    * batchPay: allows the farmer to send an array of addresses and their respective balances to be paid, so that they can be transferred ETH.

- Foreman role: Foremen are semi-trusted workers who are in charge of checking in the workers for the day. Foreman function: batchCheckIn.
    * batchCheckIn: allows the foreman to send an array of addresses to the contract who will be checked in for today.

- Worker Role: The worker role has 3 screens: home screen which displays some useful information, qrCode screen which makes it easier to scan their wallet address, and calendar screen that should show when they have been checkedIn.

<br>

## Running the Application
Prerequisites:
* Need Expo (You can download through npm)
* Need Expo application downloaded on phone
* Run `npm install` in order to download all of the correct dependencies onto your machine

You can run this application locally by typing in the terminal: `expo start`.
This will generate a scannable QR code, which will run the application onto your device.

<br>

## Deploying the Application
Prerequisites:
* Need Expo developer account (You can sign up on their website)
* expo-cli installed (can be downloaded through npm)

These have been set, but can be changed
* Set app name and app slug name to desired values
* Write a little description about the application 
* Configure splash screen / icons correctly

1. To deploy this application, first login into expo-cli: `expo login`. Provide credentials.
2. `expo publish` - this command will package the application and then publish it onto your Expo Developer account.
3. Access the application by looking at published applications under profile. There should be a shareable link to use this application, as well as a scannable QR code. Now, the application can be accessed by anyone, anywhere, as long as they have the Expo Go application on their device, and are authorized to access this application. Authorization can be changed on the Expo Go website.

## Additional Notes:
There are lots of dependencies that will probably be out of date as this project gets passed on. Be very careful when trying to update a certain package or when forcing updates/audits in npm, as this can mess up other dependencies and leave you incredibly confused. One major dependency update will probably take form in the Expo version. Our current version is 45.0.0, but will most likely be deprecated as time goes on.