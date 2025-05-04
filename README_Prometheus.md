# Task Bounty Tracker: Decentralized Task Monitoring and Economic Health Management for Koii Network

## Project Overview

The Task Bounty Tracker is a monitoring tool designed to track and manage task bounties on the Koii network. It provides a critical service for task managers and stakeholders by continuously monitoring the bounty status of different tasks across multiple platforms.

### Key Features

- **Multi-Platform Task Tracking**: Simultaneously fetches and analyzes task data from both Koii and KPL (Koii Puddle Layer) networks
- **Bounty Status Monitoring**: Performs real-time checks on task bounty amounts, identifying tasks with insufficient or depleted funds
- **Automated Alerting**: Sends webhook notifications for critical bounty-related events
- **Periodic Checks**: Runs automated task data retrieval and analysis every 10 minutes

### Core Functionality

The application performs the following key operations:
- Retrieves task account information from Koii and KPL networks
- Calculates remaining bounty rounds for each task
- Identifies tasks with:
  - Completely depleted bounty funds
  - Bounty amounts insufficient for multiple future rounds
- Generates and sends automated alerts via webhook for tasks requiring immediate attention

### Problem Solved

The Task Bounty Tracker addresses the critical need for continuous monitoring of task economic viability on decentralized networks. By providing real-time insights into task bounty statuses, it helps task managers and network participants maintain the health and sustainability of tasks on the Koii ecosystem.

## Getting Started, Installation, and Setup

### Prerequisites

- Node.js (version 14 or later recommended)
- Yarn package manager
- A compatible operating system (Windows, macOS, or Linux)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-bounty-tracker.git
   cd task-bounty-tracker
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Configuration

1. Create a `.env` file by copying the `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Configure the following environment variables in the `.env` file:
   - `WEBHOOK_URL`: URL for webhook integration
   - `MONGO_URI`: MongoDB connection string

### Running the Project

#### Development Mode
To run the project in development:
```bash
node main.js
```

#### Docker Deployment
You can also run the project using Docker:
```bash
docker-compose up --build
```

### Build for Production

To build the project:
```bash
webpack
```

### Additional Notes

- Ensure all dependencies are correctly installed before running
- Some scripts in the `scripts/` directory may require specific configurations
- Check the project's documentation for detailed usage instructions

## Usage

The Task Bounty Tracker is a Node.js application that monitors task bounties across different platforms and sends notifications about their status.

### Running the Application

To run the Task Bounty Tracker, you'll need Node.js installed. The application uses environment variables for configuration.

#### Prerequisites
- Node.js
- Yarn or npm
- A configured `.env` file with `WEBHOOK_URL` set

#### Execution

The application runs automatically with the following behavior:
- Fetches task data from Koii and KPL platforms
- Checks bounty amounts for each task
- Sends webhook notifications for:
  - Tasks with bounties depleted
  - Tasks with bounties below a critical threshold

##### Running Directly
```bash
node main.js
```

The script will:
- Run immediately on start
- Repeat the check every 10 minutes (600,000 milliseconds)
- Log task details and memory usage
- Send webhook notifications for tasks with low bounties

##### Example Output
```
Task ExampleTask Bounty Less than 5 rounds! TASK_PUBLIC_KEY
Memory usage: { rss: 123456, heapTotal: 67890, ... }
```

#### Key Behaviors
- Checks tasks from multiple platforms
- Identifies tasks with insufficient bounties
- Sends notifications via configured webhook
- Runs on a periodic interval

##### Notification Triggers
- Bounty completely depleted
- Bounty less than 10 rounds of funding
- Special handling for "Free" tasks with more stringent checks

### Important Notes
- Requires a properly configured `.env` file
- Uses webhook URL for notifications
- Automatically runs on a 10-minute interval
- Provides console logging for tracking

## Command Reference

This project provides several utility scripts for blockchain-related tasks. These scripts are located in the `scripts/` directory and can be run using Node.js.

#### Available Utility Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `KeypairToPublicKey.js` | Convert a keypair to a public key | `node scripts/KeypairToPublicKey.js` |
| `Uint8ToPublicKey.js` | Convert Uint8 array to a public key | `node scripts/Uint8ToPublicKey.js` |
| `Task_account_info.js` | Retrieve task account information | `node scripts/Task_account_info.js` |
| `task_cleaner.js` | Clean up task-related data | `node scripts/task_cleaner.js` |
| `task_cleaner_overlong.js` | Clean up overlong task data | `node scripts/task_cleaner_overlong.js` |
| `task_stake_pot_account_calculation.js` | Calculate stake pot account details | `node scripts/task_stake_pot_account_calculation.js` |

#### Main Entry Point

The main application entry point is `main.js`, which can be run using:

```bash
node main.js
```

#### Note on Commands

- Most scripts require appropriate environment configuration
- Ensure all necessary dependencies are installed before running scripts
- Some scripts may require specific input parameters or environment variables

#### NPM Scripts

Currently, the only defined NPM script is:

| Command | Description |
|---------|-------------|
| `npm test` | Runs tests (currently outputs an error as no tests are specified) |

## Configuration

The project uses environment variables for configuration. Configuration can be managed through a `.env` file.

### Environment Variables

Create a `.env` file in the project root directory with the following variables:

```env
WEBHOOK_URL=""        # URL for webhook integration (required)
MONGO_URI=""          # MongoDB connection string (required)
```

#### Configuration Notes

- `WEBHOOK_URL`: Specify the webhook endpoint for notifications or integrations
- `MONGO_URI`: Provide the full connection string for your MongoDB database

##### Example .env File

```env
WEBHOOK_URL="https://your-webhook-endpoint.com/webhook"
MONGO_URI="mongodb://localhost:27017/your-database"
```

The configuration uses `dotenv` for managing environment variables, allowing easy setup and environment-specific configurations.

## Project Structure

The project is organized into several key directories and files to support its functionality:

### Root Directory
- `main.js`: Primary entry point of the application
- `package.json`: Project dependencies and scripts configuration
- `Dockerfile`: Container configuration for application deployment
- `docker-compose.yaml`: Multi-container Docker application configuration
- `.env.example`: Template for environment configuration
- `yarn.lock`: Yarn dependency lock file

### Scripts Directory
The `scripts/` folder contains utility scripts for various operations:
- `KeypairToPublicKey.js`: Utility for converting keypair to public key
- `Task_account_info.js`: Script for retrieving task account information
- `Uint8ToPublicKey.js`: Utility for converting Uint8 to public key
- `task_cleaner.js`: Script for cleaning up tasks
- `task_cleaner_overlong.js`: Extended task cleaning script
- `task_stake_pot_account_calculation.js`: Calculations for stake pot accounts

### WebAssembly Bincode Deserializer
The `webasm_bincode_deserializer/` directory contains WebAssembly and TypeScript files for binary decoding:
- `bincode_js.js`: JavaScript implementation of binary decoding
- `bincode_js.d.ts`: TypeScript type definitions
- `bincode_js_bg.wasm`: WebAssembly binary for performance-critical decoding
- `bincode_js_bg.wasm.d.ts`: WebAssembly type definitions
- `zstd.wasm`: WebAssembly file, likely for compression/decompression

### Additional Utility Scripts
- `fetchKPL.js`: Script for fetching KPL-related data
- `fetchKoii.js`: Script for fetching Koii-related data

## Technologies Used

### Programming Languages
- JavaScript (Node.js)
- TypeScript (via type definitions)

### Core Libraries and Frameworks
- [@_koi/web3.js](https://www.npmjs.com/package/@_koi/web3.js): Blockchain interaction library
- [@_koii/web3.js](https://www.npmjs.com/package/@_koii/web3.js): Koii network blockchain library
- Axios: HTTP client for making API requests
- Dotenv: Environment variable management

### Development Tools
- Webpack: Module bundler
- Webpack CLI: Command-line interface for Webpack

### Additional Modules
- Config: Configuration management
- Node.js built-in modules:
  - fs: File system operations
  - stream: Stream handling

### WebAssembly Components
- Bincode JS: WebAssembly-based binary serialization/deserialization
- Zstandard (zstd) WebAssembly module: Compression library

### Containerization
- Docker: Containerization platform (evidenced by Dockerfile)
- Docker Compose: Multi-container Docker application management

### Package Management
- Yarn: Dependency management and package installation

## Additional Notes

### Performance and Resource Management

The application is designed with built-in performance monitoring and periodic execution:
- Runs the main task tracking process every 10 minutes (600,000 milliseconds)
- Logs memory usage after each execution to help monitor resource consumption

### Webhook Integration

The project uses a webhook mechanism for sending notifications about task bounty status:
- Uses an environment variable `WEBHOOK_URL` to configure the notification endpoint
- Sends messages for different bounty scenarios:
  * Bounty exhaustion alerts
  * Low bounty balance warnings
  * Task-specific notifications

### Task Data Sources

The application aggregates task data from multiple sources:
- Fetches task information from KPL and Koii platforms
- Processes task data to identify bounty-related conditions
- Supports both "Free" and standard task types

### Error Handling

Robust error management is implemented:
- Catches and logs errors during task data retrieval and processing
- Continues execution even if individual task processing fails
- Provides console logging for debugging and monitoring purposes

### Environment Configuration

Utilizes environment-based configuration:
- Uses `.env` file for sensitive configuration
- Supports dynamic webhook URL configuration
- Enables flexible deployment across different environments

## Contributing

We welcome contributions to the Task Bounty Tracker project! Here are some guidelines to help you get started:

### How to Contribute

1. **Fork the Repository**: Create a fork of the main repository to your GitHub account.

2. **Clone Your Fork**: 
   ```bash
   git clone https://github.com/[your-username]/task-bounty-tracker.git
   cd task-bounty-tracker
   ```

3. **Create a Branch**: 
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Setup

- Ensure you have Node.js installed
- Use Yarn as the package manager
- Install dependencies:
  ```bash
  yarn install
  ```

### Contribution Guidelines

#### Code Style
- Follow consistent coding practices
- Use meaningful variable and function names
- Add comments to explain complex logic

#### Submitting Changes
- Commit messages should be clear and descriptive
- Include a detailed description of your changes in the pull request

#### Testing
- Currently, no specific test suite is defined
- Manually test your changes thoroughly
- Ensure no breaking changes to existing functionality

### Pull Request Process
1. Ensure your code follows the project's guidelines
2. Update the README.md with details of changes if applicable
3. Your pull request will be reviewed by the maintainers

### Reporting Issues
- Use GitHub Issues to report bugs or suggest improvements
- Provide detailed information about the issue or suggestion
- Include steps to reproduce for bug reports

### Notes
- This project uses Koii and Web3.js technologies
- Make sure to review the project's dependencies before making significant changes

## License

The project is licensed under the ISC License. 

### License Details

The ISC License is a permissive free software license published by the Internet Systems Consortium (ISC). It is functionally equivalent to the MIT License and is characterized by its simplicity.

#### Key Points
- Allows commercial and non-commercial use
- Permits modification and distribution
- Requires preservation of copyright and license notices
- Provides the software "as is" with no warranties

For the full license text, please refer to the standard ISC License terms.

#### Permissions
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

#### Limitations
- ❌ No liability
- ❌ No warranty