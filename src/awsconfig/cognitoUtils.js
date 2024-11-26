import { v4 as uuidv4 } from 'uuid';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AdminConfirmSignUpCommand,
  ListUsersCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

if (!COGNITO_CLIENT_ID || !COGNITO_USER_POOL_ID) {
  throw new Error('Las variables de entorno de Cognito no están configuradas correctamente');
}

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION
});

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Formato de email inválido');
  }
};

const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
  }
};

export const cognitoService = {
  signUp: async (email, password) => {
    validateEmail(email);
    validatePassword(password);
console.log('Esta es la password que llega aqui ' + password)
    const username = uuidv4();
    const command = new SignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email }
      ],
    });

    try {
      const response = await cognitoClient.send(command);
      console.log('Usuario registrado en Cognito:', response.UserSub);
      return {
        success: true,
        userSub: response.UserSub,
        username: username
      };
    } catch (error) {
      console.error('Error en signUp Cognito:', error);
      let errorMessage = 'Error al registrar usuario';

      switch (error.name) {
        case 'UsernameExistsException':
          errorMessage = 'El email ya está registrado';
          break;
        case 'InvalidPasswordException':
          errorMessage = 'La contraseña no cumple con los requisitos de seguridad';
          break;
        case 'InvalidParameterException':
          errorMessage = 'Parámetros inválidos';
          break;
      }

      throw new Error(errorMessage);
    }
  },


  confirmSignUp: async (email, code) => {
    try {
      // Primero intentamos obtener el usuario por email para conseguir su username
      const listUsersCommand = new ListUsersCommand({
        UserPoolId: COGNITO_USER_POOL_ID,
        Filter: `email = "${email}"`,
        Limit: 1
      });

      const usersResult = await cognitoClient.send(listUsersCommand);
      if (!usersResult.Users || usersResult.Users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const username = usersResult.Users[0].Username;

      // Ahora confirmamos con el username correcto
      const confirmCommand = new ConfirmSignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: username,
        ConfirmationCode: code
      });

      await cognitoClient.send(confirmCommand);
      console.log('Email verificado exitosamente para:', email);
      return { success: true };
    } catch (error) {
      console.error('Error en confirmSignUp:', error);
      let errorMessage = 'Error en la verificación';

      switch (error.name) {
        case 'CodeMismatchException':
          errorMessage = 'Código de verificación incorrecto';
          break;
        case 'ExpiredCodeException':
          errorMessage = 'El código ha expirado';
          break;
        case 'UserNotFoundException':
          errorMessage = 'Usuario no encontrado';
          break;
        case 'NotAuthorizedException':
          errorMessage = 'El usuario ya está verificado';
          break;
        default:
          errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  resendConfirmationCode: async (email) => {
    try {
      // Primero obtener el username asociado al email
      const listUsersCommand = new ListUsersCommand({
        UserPoolId: COGNITO_USER_POOL_ID,
        Filter: `email = "${email}"`,
        Limit: 1
      });

      const usersResult = await cognitoClient.send(listUsersCommand);
      if (!usersResult.Users || usersResult.Users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const username = usersResult.Users[0].Username;

      // Ahora reenviar el código usando el username
      const command = new ResendConfirmationCodeCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: username
      });

      await cognitoClient.send(command);
      console.log('Código de verificación reenviado a:', email);
      return { success: true };
    } catch (error) {
      console.error('Error al reenviar código:', error);
      let errorMessage = 'Error al reenviar el código';

      switch (error.name) {
        case 'UserNotFoundException':
          errorMessage = 'Usuario no encontrado';
          break;
        case 'InvalidParameterException':
          errorMessage = 'Parámetros inválidos';
          break;
        case 'LimitExceededException':
          errorMessage = 'Se ha excedido el límite de intentos';
          break;
        case 'TooManyRequestsException':
          errorMessage = 'Demasiadas solicitudes, intente más tarde';
          break;
        default:
          errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },


  signIn: async (email, password) => {
    validateEmail(email);
    validatePassword(password);

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
      let errorMessage = 'Error al iniciar sesión';

      switch (error.name) {
        case 'NotAuthorizedException':
          errorMessage = 'Credenciales incorrectas';
          break;
        case 'UserNotConfirmedException':
          errorMessage = 'Usuario no verificado';
          break;
        case 'UserNotFoundException':
          errorMessage = 'Usuario no encontrado';
          break;
      }

      throw new Error(errorMessage);
    }
  },

  forgotPassword: async (email) => {
    validateEmail(email);

    const command = new ForgotPasswordCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email
    });

    try {
      await cognitoClient.send(command);
      return { success: true };
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      throw new Error('Error al solicitar el restablecimiento de contraseña');
    }
  },

  confirmForgotPassword: async (email, code, newPassword) => {
    validateEmail(email);
    validatePassword(newPassword);

    const command = new ConfirmForgotPasswordCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    });

    try {
      await cognitoClient.send(command);
      return { success: true };
    } catch (error) {
      console.error('Error en confirmForgotPassword:', error);
      let errorMessage = 'Error al restablecer la contraseña';

      switch (error.name) {
        case 'CodeMismatchException':
          errorMessage = 'Código de verificación incorrecto';
          break;
        case 'ExpiredCodeException':
          errorMessage = 'El código ha expirado';
          break;
      }

      throw new Error(errorMessage);
    }
  }
};

export { cognitoClient };