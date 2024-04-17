# Startup
Startup application for BYU CS 260

## Elevator Pitch
The Super Bowl is coming up! One friend brings the wings, one friend brings the chips and salsa, and others bring other things. But wait, wings are way more expensive than simple chips and salsa. Shouldn't everyone contribute equally to the gathering? But who needs to send whom how much money? It's such a pain to figure that out, especially when you are throwing the biggest Super Bowl party in Provo! With the "Venmo Calculator", you can simply create a group with your friends, enter in how much you spent, and let the website tell you how much money you need to send to each person. It's that simple!

## Key Features
#### HTML
Uses HTML to create a structure of each aspect of the application. There will be three pages. The first one will be to login. The second one will be to select a group to view/to create a new group. The third one will display the group information (how much the user owes each person in the group).
#### CSS
Uses CSS to make the elements on the pages look good using good color choices and dynamic screen sizes.
#### JavaScript
Provides the logic behind the calculator, logging in, and creating groups. Also allows users to enter the amount they have spent. Also provides the ability for dynamic views like the list of people.
#### Web Service
Backend service with endpoints for:

- Login verification
- Group retrieval
- Creating groups
- Amount retrieval within group
- Entering amount spent by user
#### Authentication
As users log in, their credentials will be authenticated, then their username will display in the upper right corner throughout their session.
#### Database Data
Store users, groups, and amounts spent within group.
#### WebSocket Data
As a user enters the amount they have spent, it will populate in the group for other users. 

## Wireframe Sketches
![alt text](<image0 (11).jpeg>)

![alt text](image3.jpeg)

![alt text](image2.jpeg)

![alt text](<image1 (6).jpeg>)

## HTML Deliverable
All four pages required in this application have been created in HTML. They have no functionality, but each one is reachable through the buttons on the pages. 

## CSS Deliverable
All four pages are now styled correctly with CSS. They are still lacking in functionality, but they don't look bad anymore. I am already pretty comfortable with CSS from prior work, but I learned a few things as I worked on this deliverable. For example, I played around a lot with gradients and shadows to make my pages more aesthetically pleasing. I also learned about the "@media" selector to make pages more responsive to screen sizes. I learned a lot about different color pallettes. I asked a few friends and colleagues to look at my site and give suggestions, and they offerred some advice on some of the colors and sizings I was using, which was very helpful.

## Javacript Deliverable
This web app is now completely functional in a browser for multiple users. Since all data is only stored in localstorage, multiple users must be using the same machine and the same browser. Functionality now includes the following:

1) **Login** - Users can now enter a username and password to login. Authentication of correct password will be implemented when the database deliverable is implemented. For now, a user is created/logged in purely based on the username. This username is then displayed on the rest of the pages in the top right.

2) **Database** - When logged in, users will see any groups they have joined. They can also create new groups by clicking the "+ Create Group" button. When a group is selected, they can also see all other users who have joined the group. They can also see how much each user entered as their payment.

3) **Web Socket** - Right now, when users change how much money they entered, the database is changed to reflect that. When the websocket deliverable is implemented, this will be changed to automatically change both the database and be represented on any other logged-in user's screen.

4) **Application Logic** - Users can see accurately how much they should venmo each person in the group to make the amount each person contributed equal. 

## Service Deliverable
This web app is still fully functional in a single browser. It now runs on a node.js server using express. Endpoints have been created for logging in and storing the groups. This means that rather than localstorage storing those values, they are accessible through API endpoints on the express server. 

To view the functionality of the web app currently, I suggest logging in as a user, creating a group, then copying the group id. Once this is done, log in as another user and join that group by pasting the group id. This will allow you to see real data and experiment with how the app works.

## Login Deliverable
This web app now works across multiple browsers. Its data is now persistable in a mongodb database. This is made possible by changing the API endpoints from the last deliverable to now access mongodb databases which store the necessary information. 

Read the second paragraph of the service deliverable to see how to best view the functionality of the application. 

## Websocket Deliverable
This web app now automatically updates the values of debts owed to other users using websockets. When a user changes their input, every other user currently connected to the socket will instantaneously be able to see their new value and how much they owe.

To best test the functionality of this deliverable:

1) Login or create a user.
2) Join or create a group, navigate to the groupview page.
3) Copy the group id.
4) Login or create another user.
5) Join the group by pasting the id.
6) Change the values on either of the user's page, and notice that the amount owed changes when doing so.