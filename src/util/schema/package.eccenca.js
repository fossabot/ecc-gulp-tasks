module.exports = {
    $schema: 'http://json-schema.org/draft-06/schema#',
    title: 'JSON schema for NPM package.json files',
    definitions: {
        package: {
            type: 'object',
            properties: {
                name: {
                    pattern: '^(@eccenca/[a-z-]+|ecc-[a-z-]+)$',
                },
                version: {
                    format: 'semver',
                },
                description: {
                    pattern: '^[A-Z]',
                    minLength: 20,
                    maxLength: 120,
                },
                main: {},
                keywords: {},
                author: {
                    type: 'string',
                    template:
                        'eccenca GmbH <opensource@eccenca.com> (http://eccenca.com)',
                },
                license: {
                    type: 'string',
                    enum: ['GPL-3.0', 'MIT'],
                },
                scripts: {
                    properties: {
                        prepackage: {
                            format: 'prepackage',
                        },
                        precommit: {
                            type: 'string',
                            template: 'lint-staged',
                        },
                    },
                    required: ['precommit', 'lint', 'test', 'start'],
                },
                dependencies: {},
                peerDependencies: {
                    type: 'object',
                    properties: {
                        react: {
                            template: '*',
                        },
                    },
                },
                devDependencies: {},
                optionalDependencies: {},
                repository: {
                    properties: {
                        type: {
                            template: 'git',
                        },
                    },
                },
                bugs: {},
                publishConfig: {},
                es5: {
                    type: 'string',
                },
                es6: {
                    type: 'string',
                },
                private: {},
                'lint-staged': {
                    type: 'object',
                    properties: {
                        '*.{js,jsx}': {
                            type: 'string',
                            template: 'eslint',
                        },
                    },
                    required: ['*.{js,jsx}'],
                },
            },
            required: [
                'name',
                'version',
                'description',
                'main',
                'author',
                'license',
                'lint-staged',
            ],
            additionalProperties: false,
        },
        github: {
            type: 'object',
            properties: {
                repository: {
                    url: {
                        type: 'string',
                        template: 'https://github.com/eccenca/<%= name %>.git',
                    },
                },
                bugs: {
                    properties: {
                        url: {
                            type: 'string',
                            template:
                                'https://github.com/eccenca/<%= name %>/issues',
                        },
                    },
                },
            },
            required: ['bugs', 'repository'],
        },
    },
    allOf: [
        {
            $ref: 'package',
        },
        {
            $ref: '#/definitions/package',
        },
        {
            properties: {
                repository: {
                    type: 'object',
                    properties: {
                        url: {
                            type: 'string',
                            template: [
                                'https://gitlab.eccenca.com/elds-ui/<%= name %>',
                                'https://gitlab.eccenca.com/elds-ui/<%= name %>.git',
                                'https://github.com/eccenca/<%= name %>.git',
                            ],
                        },
                    },
                },
                publishConfig: {
                    properties: {
                        registry: {
                            type: 'string',
                            template: 'https://registry.npmjs.org/',
                        },
                    },
                },
            },
            required: ['repository'],
            dependencies: {
                publishConfig: {
                    $ref: '#/definitions/github',
                },
            },
        },
    ],
};
