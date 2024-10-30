import { 
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    ConfirmSignUpCommand,
    AdminConfirmSignUpCommand
  } from "@aws-sdk/client-cognito-identity-provider";
  
  const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
  const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
  
  const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
  
  export const cognitoService = {
    // Registro de usuario en Cognito
    signUp: async (email, password) => {
      const command = new SignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
        ],
      });
  
      try {
        const response = await cognitoClient.send(command);
        return { success: true, userSub: response.UserSub };
      } catch (error) {
        console.error('Error en signUp Cognito:', error);
        throw error;
      }
    },
  
    // Confirmar registro (si es necesario)
    confirmSignUp: async (email, code) => {
      const command = new ConfirmSignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
      });
  
      try {
        await cognitoClient.send(command);
        return { success: true };
      } catch (error) {
        console.error('Error en confirmSignUp Cognito:', error);
        throw error;
      }
    },
  
    // Confirmar registro desde el admin (automático)
    adminConfirmSignUp: async (email) => {
      const command = new AdminConfirmSignUpCommand({
        UserPoolId: COGNITO_USER_POOL_ID,
        Username: email,
      });
  
      try {
        await cognitoClient.send(command);
        return { success: true };
      } catch (error) {
        console.error('Error en adminConfirmSignUp Cognito:', error);
        throw error;
      }
    },
  
    // Iniciar sesión
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