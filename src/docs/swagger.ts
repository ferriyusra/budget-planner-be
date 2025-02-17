import swaggerAutogen from 'swagger-autogen';

const doc = {
	info: {
		version: 'v0.0.1',
		title: 'Docs API Acara',
		description: 'Docs API Acara',
	},
	servers: [
		{
			url: 'http://localhost:9852/api',
			description: 'Local server',
		},
		{
			url: 'your development',
			description: 'Development server',
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
			},
		},
		schemas: {
			LoginRequest: {
				identifier: 'yourname',
				password: 'yourpassword',
			},
			RegisterRequest: {
				fullName: 'yourname',
				username: 'yourusername',
				email: 'youremail@mail.com',
				password: 'yourpassword',
				confirmPassword: 'yourConfirmpassword',
			},
			UpdateProfileRequest: {
				fullName: '',
				profilePicture: '',
			},
			UpdatePasswordRequest: {
				oldPassword: '',
				password: '',
				confirmPassword: '',
			},
			ActivationRequest: {
				code: 'abcyznsqwe',
			},
		},
	},
};
const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/**'];

swaggerAutogen({
	openapi: '3.0.0',
})(outputFile, endpointsFiles, doc);
