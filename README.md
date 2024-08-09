# Recipe Manager

## Intro

This is a fork of a project I completed with other members. 
The original can be found [here](https://github.com/kawrou/RecipEasy-recipe-manager)

As we created the app as a proof of concept in a short period, there were a lot of tests that needed fixing and improvements I wanted to make hence I created a separate respository. 

Apart from fixing tests which I started on the original repo, you can see what enhancements I've worked on by checking out the closed issues above. I'm currently trying to enhance authentication and fix how JWT is handled on the frontend. 

## Description
Over the course of 2 weeks (8 or 9 days), we are building a recipe
manager web application. 
We will be desigining the app by first finding problems with current
solutions and discovering features we want to implement for an MVP. 

The main feature, the "skateboard" to our "car", is a page
scaper function that will allow users to input a URL, retrieve the
recipe, and have that saved to their profile. 

The first major interaction will follow this flow:
**Sign up -> retrieve recipe -> edit recipe -> see recipe in profile page**

Once our first goal is met, we will implement the following features:
A user can edit their saved recipe. 
A user can add their own recipe. 
A user can search filter their recipes based on keywords / tags
A user can see the nutritional value for each recipe. 

## Video Presentation Link

[![Watch the video](https://img.youtube.com/vi/FvwLQTpGBdE/0.jpg)](https://youtu.be/FvwLQTpGBdE)

Clicking the link will open YouTube. 

## TechStack
-MERN
-Tailwind

## Quick-Start

### Install NVM
1. Make sure you have node and NVM installed. 
```
brew install nvm
```
2. Install the latest version of [Node.js](https://nodejs.org/en/)

### Set up the project
1. Fork/Clone this repository.
2. Install dependencies for the 'frontend' & 'api' application: 

```
cd frontend
npm install

cd ../api
npm install
```

3. Install an ESLint plugin for your editor
4. Intall MongoDB if you don't have one on your computer

```
brew tap mongodb/brew
brew install mongodb-community@6.0
```
   _Note:_ If you see a message that says
   `If you need to have mongodb-community@6.0 first in your PATH, run:`, follow
   the instruction. Restart your terminal after this.

5. Start MongoDB

```
brew services start mongodb-community@6.0
```

### Set up environment variables

You need to create '.env' files for both the frontend and the api.

#### Frontend
Create a file 'frontend/.env` with the following:

```
VITE_BACKEND_URL="http://localhost:3000"
```

#### Backend
Create 'api/.env' with the following:

```
MONGODB_URL="mongodb://0.0.0.0/recipeasy"
NODE_ENV="development"
JWT_SECRET="secret"
```

### Running the server

1. In the api directory, run:
```
npm run dev
```
2. In the frontend, run:
```
npm run dev
```

