# BeaconMind Students Mobile App

A React Native mobile application built with Expo that enables doctors to assess students for suicide risk, substance abuse, and other mental health concerns.

## Overview
BeaconMind Students is a comprehensive assessment platform providing structured questionnaires for mental health screening, including:
- **ASQ Assessment**: Anxiety and stress screening questionnaire
- **Substance Use Assessment**: Evaluates levels of substance use and dependence
- **MARS Assessment**: Mobile App Rating Scale for evaluating app quality

The app features a dynamic assessment engine capable of handling various question types:
- Multiple-choice questions (MCQ)
- Multiple-select questions (MSQ)
- Text input responses
- Star rating responses

## Getting Started
### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation
1. Clone the repository: `git clone <repository-url> && cd beaconmind.students`
2. Install dependencies: `npm install`
3. Start the development server: `npx expo start`

## App Structure
- **`/app`**: Main application screens using file-based routing
- **`/components`**: Reusable UI components including `AssessmentComponent.tsx`
- **`/assessmentstore`**: Assessment data and question definitions
- **`/context`**: Application-wide state management

## Key Features
- **Dynamic Question Flow**: Supports conditional branching based on user responses
- **Multiple Question Types**: MCQ, MSQ, text input, and star ratings
- **Progress Tracking**: Visual indication of assessment completion
- **Response Submission**: Secure submission of assessment data to backend
- **Authentication**: User authentication and profile management

## Usage
After signing in, users can: (1) Access assessments from the home screen, (2) Complete questionnaires with different response types, (3) Navigate through questions, and (4) Submit responses securely to the backend system.

## Privacy and Consent
The app includes comprehensive informed consent documentation to ensure users understand how their data will be used in accordance with ethical research standards.

## Development
This project is built with: React Native/Expo, React Navigation, Context API for state management, and Async Storage for local data persistence.

## Learn More
- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/docs/getting-started)
