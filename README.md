Shelfie is a book management app that helps you keep track of what you’ve read and what you want to read. You can log books into your personal library, receive book recommendations, and share your reviews on the explore page for everyone to see.

Here are a few of it's features:
- 🔎 A search page, for users to browse through books fetched from the OpenLibrary API, and then add books to their shelf or write a review on them.
- 🔭 An explore page for users to read reviews posted by others and search for reviews and users.
- 📚 Shelf, a locally stored library of books that users want to read/are reading.
- ✏️ Instead of a boring review with a title and one large paragraph, Shelfie prompts users with questions about the book, for example, one question is "How did the book make you feel?"
- 🔮 Scout, a page that uses GPT-3.5 to learn from reviews that you've liked and your searches to recommend books to you, in a Tinder-like swipe page.

# Running it locally
The following are steps to install the app. If you run into any problems, message me on the Slack ([@mihi](https://hackclub.slack.com/team/U05PRRU5GSJ)), or email me at mihir@pidgon.com!

If you do not have Apple Developer Program membership, follow the steps to install it on Simulator
## On the Simulator
Make sure you have the Simulator app on your Mac, and you have Xcode Command Line Tools installed.

First, clone the repo and `cd` into the folder. Run the following commands:
```bash
npm i
npm install -g eas-cli
```
Since this app uses Expo, you'll need to log in with your account by running the below command. If you don't have one, you'll be prompted to sign up.
```bash
eas login
```
Once that's done, you'll need to configure your build. You can adjust as needed, hopefully nothing should break. 
```bash
eas build:configure
```
Finally, build the app. This should take 10-15 minutes, but there may be a queue.

```bash
eas build --platform ios --profile development
```

## On your iOS Device
>  ⚠️ **You need an active subscription to the Apple Developer Program to install it on your device.**

Follow the same instructions for installing it on the Simulator, but leave out the last step.

Run this command to create an ad hoc provisioning profile for your device
```bash
eas device:create
```
Finally, run
```bash
eas build --platform ios --profile development
```
to build the app. This should take 10-15 minutes and there may be a queue.

To install it on your device, first enable [Developer mode](https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device) and scan the QR code that appeared on your terminal after the app finished building.

## TestFlight

If you have an iOS device and don't want to build it locally, DM me on the slack ([@mihi](https://hackclub.slack.com/team/U05PRRU5GSJ)) for a TestFlight link! I don't have an Android build yet, but let me know if you're able to do it!
