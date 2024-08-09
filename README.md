# Profile Builder

Welcome to the Profile Builder project! The TalPods internal recruitment team faced challenges in creating optimal profiles for talents to present to potential company hiring managers, taking extensive hours to complete. The profile builder tool aimed to reduce this time to less than 15 minutes. The team developed the profile page using a structured data model and a design validated through testing with customers. In the second sprint, the team was divided to create a dashboard tool that enables profile creation using ChatGPT APIs. As a result, the system now allows profile creation in less than 4 minutes.

Originally, it was developed using AWS CodeCommit, and now we have migrated it to GitHub for better collaboration and visibility.

## Project Description

The Profile Builder is a tool that leverages Generative AI to help recruiters build detailed profiles in less than 10 minutes. By uploading a candidate's resume, the AI generates comprehensive details, streamlining the profile creation process. The profile built can be viewed using the profile view application repository in the below link
[Profiles-Built-Application](https://github.com/talpods/talent-profiles)

## Team Members

Project built by a team of passionate young engineers as part of the first [Cohort of TalPods-Jusoor Tech Talent Pipeline](https://talpods.io/talpods-jusoor-tech-talent-pipeline.html) project

- [mhmmdkhoulani](https://github.com/mhmmdkhoulani)
- [FaisalMinawi](https://github.com/FaisalMinawi)
- [JoudyAlAshkar](https://github.com/JoudyAlAshkar)
- [Abdalkader-Kouhda](https://github.com/Abdalkader-Kouhda)
- [lAhmadBakkarl](https://github.com/lAhmadBakkarl)
- [abdel-hady](https://github.com/abdel-hady)
- [AliHousein](https://github.com/AliHousein)

## Project Overview

The Profile Builder project consists of four main Lambda functions and a frontend developed using React, Redux, Ant Design, and Tailwind CSS. Each Lambda function is managed with its own `serverless.yaml` file, facilitating easy deployment and management with the Serverless Framework.

## Technologies used 

JavaScript, Node JS Dynamo DB, React JS, Ant Design, Redux Toolkit, HTML, CSS, Tailwind CSS, Serverless JS, Openai API, Express JS, EJS, AWS Lambda, AWS S3, CloudFront, Code Commit for Git, CI/CD using AWS Code Build and Code Pipeline

## AWS Architecture
![aws2 drawio](https://github.com/user-attachments/assets/800538fa-ec0d-437e-8d64-b828db079a95)


## Getting Started

### Prerequisites

To run this project, you need to have the following installed:

- Node.js
- npm (Node Package Manager)
- AWS CLI
- Serverless Framework
- React

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/talpods/profile-builder.git
    cd profile-builder
    ```

2. **Install dependencies:**

    For Lambda functions:

    ```bash
    cd path/to/lambda/function
    npm install
    ```

    For frontend:

    ```bash
    cd frontend
    npm install
    ```

### Deployment

Each Lambda function is defined in its own directory with a `serverless.yaml` file. Navigate to the directory of the Lambda function you want to deploy and run the following command:

    ```bash
    serverless deploy
    ```

### Running the Frontend

Navigate to the `frontend` directory and start the development server:

    ```bash
    cd frontend
    npm start
    ```

This will start the React application on `http://localhost:3000`.

## Usage

Once the project is set up and running, you can access the application locally at `http://localhost:3000`. Follow the instructions within the application to build and manage profiles.

## Contributing

We welcome contributions to improve this project! Please fork the repository, create a new branch, and submit a pull request with your changes. Ensure your code adheres to the project's coding standards and includes appropriate tests.

## Example Screenshots
### Login
![Screen Shot 2024-08-07 at 5 47 53 PM](https://github.com/user-attachments/assets/950f03b3-7421-48fe-88fd-b2e1ba78429d)
### Create profile
![Screen Shot 2024-08-07 at 5 49 29 PM](https://github.com/user-attachments/assets/5fa7e475-5352-4f4b-b2a2-48a945f553fd)
### Visual editor
![Screen Shot 2024-08-07 at 5 50 19 PM](https://github.com/user-attachments/assets/cc125c9b-1b6a-4a22-9a32-6ebdab90b936)
### Editing experience
![Screen Shot 2024-08-07 at 6 15 02 PM](https://github.com/user-attachments/assets/f55c48e9-d418-49b3-90c6-be303450d378)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Happy coding! The Talpods Team
