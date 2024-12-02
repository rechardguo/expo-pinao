# Why this project?
Project created to create a pinao app help me to learn pinao

# Explore Step
1. https://expo.dev/ create an account 
- sdragonguo@163.com

2. Create a project in expo dashboard naming as Piano-learn.

https://expo.dev/accounts/rechard/projects/piano-learn

3. Create a repo in github. open github codespace. run below command
```
npm install --global eas-cli && npx create-expo-app piano-learn && cd piano-learn && eas init --id 617e743e-d660-49ef-a146-23d72a93fe6a
```
In the end of command ask you to enter email name and password of your expo.

4. npm run web 

5. build apk for android
```
eas build:configure
eas build --platform android
```
After end will genereate QR code and url.
Use port forward to get a url.
Send url to you phone by wechat or any tool.
click url to access it

# Target
1. Record pinano key down sound
2. Identity what sound
