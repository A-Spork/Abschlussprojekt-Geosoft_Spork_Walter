# Abschlussprojekt-Geosoft_Spork_Walter
 A node/mongodb based version of a corona app
 
 To use the full potential of this app tokens for the following APIs are needed:
 - LocationIQ: forward Geocoding, https://locationiq.com/docs#search-forward-geocoding
 - here: Development: Public Transit API (8.0.0), https://developer.here.com/documentation/public-transit/api-reference-swagger.html
 For full functionality of the tests its necassary to insert the key for the Geocoding Api (/public/test.js - line 32)
 
 
 
 To start the app use npm start or docker composeup.
 Then open http://localhost:3000/ in a browser
 There you can sign or log in. To save a tour go to Add A Tour, set the position and click on the map to choose the busstop. Choose the tour in the table below and save it. 
 To view your tours o to view your tours.
 When loging in after one of your tours was marked you will get a message at the welcomepage (Only once).
 
 Below is not ment for public use:
 To manage your patients tours as a doctor, log in with username: doc, password: doc, or go to http://localhost:3000/public/doc.html and insert the patients´s username and a timeperiod
 To test the functions and check if the API is available(key need to be inserted) go to Test or log in with username: test, password: test or go to http://localhost:3000/public/test.html
 To see all registered users or if you forgot your password log in with username: admin, password: admin
 
 
For usage the following packages are needed:
 - node
 - mongodb
 - boostrap
 - express
 - jquery
 - leaflet
 - qunit
 
 
 Features not necassary:
 - Integration of Planes, Ships, Taxis (Have a look at Wangerooge)
 - Useraccounts are saved by passwords
 - interactive maps and tables with layercontrole
