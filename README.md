# Dockerfile and gitlab-ci.yml Generator

## Prerequisites
Before you begin, ensure you have
- Docker installed on your system. Visit [Docker's official site](https://www.docker.com/get-started) for installation instructions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installation

To set up your local development environment:

## Clone the repository

   git clone https://gitlab.com/internship_task/dockerfilegenerator.git directoryName

## Navigate to the project directory 
   cd directoryName

## Build the Docker image 
   docker build -t my-image .

## Run the Docker container 
docker run -p <PORT:PORT> my-image

Example : docker run -p 3000:3000 my-image

Now you have got the Application running 

### Configuration

## To generate the Dockerfile and .gitlab-ci.yml based on your input configurations, follow these steps:

Access the Web Application and input your configuration. 
 
Submit the Form to generate the Dockerfile and .gitlab-ci.yml

Place the generated files in the root directory of your repository.

Ensure that your project is set up on GitLab to enable CI/CD functionalities.

Commit and Push the changes to GitLab GitLab CI/CD will automatically detect the .gitlab-ci.yml file and use it to configure your CI/CD pipeline.