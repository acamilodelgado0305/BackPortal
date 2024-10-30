import { v4 as uuidv4 } from 'uuid';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AdminConfirmSignUpCommand,
  AdminGetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const cognitoService = {
  signUp: async (email, password, phoneNumber) => {
    const username = uuidv4();
    const command = new SignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'phone_number', Value: phoneNumber }
      ],
    });

    try {
      const response = await cognitoClient.send(command);
      console.log('Usuario registrado en Cognito:', response.UserSub);
      return { success: true, userSub: response.UserSub };
    } catch (error) {
      console.error('Error en signUp Cognito:', error);
      throw error;
    }
  },

  adminConfirmSignUp: async (userSub) => {
    const command = new AdminConfirmSignUpCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: userSub,
    });

    try {
      await cognitoClient.send(command);
      console.log('Usuario confirmado en Cognito:', userSub);
      return { success: true };
    } catch (error) {
      console.error('Error en adminConfirmSignUp Cognito:', error);
      throw error;
    }
  },

  signIn: async (email, password) => {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const response = await cognitoClient.send(command);
      return {
        success: true,
        accessToken: response.AuthenticationResult.AccessToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        idToken: response.AuthenticationResult.IdToken,
      };
    } catch (error) {
      console.error('Error en signIn Cognito:', error);
      throw error;
    }
  },
};

export { cognitoClient };
