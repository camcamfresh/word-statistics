const scanner = require('sonarqube-scanner');

scanner(
	{
		serverUrl: 'http://172.16.1.1:9000',
		token: '21a46795ec4d89a42b38b3b1fd0ef7471bf8f567',
		options: {
			'sonar.sources': 'src',
			'sonar.inclusions': 'src/**/*.jsx',
			'sonar.tests.inclusions': 'src/**/*.test.js'
		},
	},
	() => process.exit()
);
