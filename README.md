# Profile Builder

Welcome to the Profile Builder project! This project is an internal initiative developed by the Talpods team. Originally, it was developed using AWS CodeCommit, and now we have migrated it to GitHub for better collaboration and visibility.

## Project Description

The Profile Builder is a tool that leverages Generative AI to help recruiters build detailed profiles in less than 10 minutes. By uploading a candidate's resume, the AI generates comprehensive details, streamlining the profile creation process.

## Team Members

This project was proudly developed by the following team members:

- [mhmmdkhoulani](https://github.com/mhmmdkhoulani)
- [FaisalMinawi](https://github.com/FaisalMinawi)
- [JoudyAlAshkar](https://github.com/JoudyAlAshkar)
- [Abdalkader-Kouhda](https://github.com/Abdalkader-Kouhda)
- [lAhmadBakkarl](https://github.com/lAhmadBakkarl)
- [abdel-hady](https://github.com/abdel-hady)
- [AliHousein](https://github.com/AliHousein)

## Project Overview

The Profile Builder project consists of four main Lambda functions and a frontend developed using React, Redux, Ant Design, and Tailwind CSS. Each Lambda function is managed with its own `serverless.yaml` file, facilitating easy deployment and management with the Serverless Framework.

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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Happy coding! The Talpods Team
