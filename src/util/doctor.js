const globby = require('globby');
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const semver = require('semver');
const cp = require('child_process');
const execSync = cp.execSync;

class Doctor {
    constructor(dir, config) {

        this.basedir = dir;
        this.pjsonFile = path.join(this.basedir, 'package.json');
        this.config = config || {};

        this.check();
    }

    heal() {

        if (!this.hasFixableProblems()) {
            return 'No fixable problems found';
        }

        let messages = 'The doctor tries to heal...';

        _.forEach(this.deleteCandidates, function(file) {
            messages += `\nTrying to delete ${file} ... `;
            try {
                fs.removeSync(file);
                messages += 'Success.';
            } catch (e) {
                messages += 'Failed.';
                messages += `\n${e.toString()}\n`;
            }
        });

        if (!_.isNull(this.fixedPJSON)) {
            messages += `\nTrying to fix ${this.pjsonFile} ... `;
            try {
                fs.writeJSONSync(this.pjsonFile, this.fixedPJSON, {spaces: 2});
                messages += 'Success.';
            } catch (e) {
                messages += 'Failed.';
                messages += `\n${e.toString()}\n`;
            }
        }

        this.check();

        return messages;

    }

    static asyncSelfCheck({dir, logger = console.log}) {

        const checkPackages = {
            'ecc-dotfiles': path.join(dir, 'node_modules', 'ecc-dotfiles', 'package.json'),
            'ecc-gulp-tasks': path.join(__dirname, '../../package.json')
        };

        _.forEach(checkPackages, (pjson, dep) => {
            try {
                const dfVersion = fs.readJsonSync(pjson).version;
                cp.exec(`yarn info ${dep} version --json`, function(err, stdout, stderr) {

                    if (err || !_.isEmpty(stderr.toString())) {
                        return;
                    }

                    try {
                        const latest = JSON.parse(stdout.toString()).data;
                        if (!semver.satisfies(dfVersion, latest)) {
                            logger(`${dep}@${dfVersion} installed. Newest version is ${latest}. Please run \`yarn upgrade ${dep}\``)
                        }
                    } catch (e) {
                        // empty catch
                    }
                });
            } catch (e) {
                // empty catch
            }
        });
    };

    check() {
        this.messages = {};
        this.deleteCandidates = [];
        this.fixedPJSON = null;

        // Check for unneeded uitest files
        this.checkNotExists([
            'common-files',
            'ui-test/index.html',
            'ui-test/component.min.js',
            'ui-test/**/*.map',
            'ui-test/**/*.eot',
            'ui-test/**/*.woff*',
            'ui-test/**/*.ttf',
            'ui-test/**/*.svg',
            'version.json',
        ]);

        // Check package.json
        this.checkPackageJson();

        this.checkGulpConfig();

        this.checkEnv();

    }

    checkEnv() {
        const messages = [];

        const checkCommands = {
            yarn: {
                cmd: '--version',
                version: '0.18.1',
                resolution: (tool, version) => {
                    return `Please run \`npm i -g ${tool}@${version}\``
                },
            }, npm: {
                cmd: '--version',
                version: '3.10.9',
                resolution: (tool, version) => {
                    return `Please run \`npm i -g ${tool}@${version}\``
                },
            }, node: {
                cmd: '--version',
                version: '6.9.1',
            },
        };

        _.forEach(checkCommands, ({cmd, version, resolution}, tool) => {

            try {
                const installedVersion = execSync(
                    `${tool} ${cmd}`,
                    {
                        cwd: this.basedir,
                    })
                    .toString()
                    .replace(/\r?\n/g, '');

                if (!semver.satisfies(installedVersion, `~${version}`, true)) {

                    let m = `You are using ${tool}@${installedVersion}.`
                    m += ` The current recommended version is ${version}.`;

                    if (_.isFunction(resolution)) {
                        m += ` ${resolution(tool, version)}.`;
                    }

                    messages.push(m);

                }

            } catch (e) {
                // we die gracefully, as the check errored, or something
            }

        });

        if (!_.isEmpty(messages)) {
            let envMessages = 'The following problems have been found with your environment:';
            _.map(messages, (message) => {
                envMessages += `\n\t${message}`;
            });

            this.messages.envMessages = envMessages;

        }


    }

    checkGulpConfig() {
        const messages = [];

        const deprectatedValues = [
            'path',
            'serverStart',
            'serverOverrides',
        ];

        _.forEach(deprectatedValues, (key) => {
            const value = _.get(this.config, key, false);

            if (value) {
                messages.push(`Please delete deprecated option '${key}': '${value}' from your gulp buildConfig.`);
            }
        });

        if (!_.isEmpty(messages)) {
            let gulpConfigMessage = 'The following problems are in this projects buildConfig:';
            _.map(messages, (message) => {
                gulpConfigMessage += `\n\t${message}`;
            });

            this.messages.gulpConfig = gulpConfigMessage;

        }


    }

    checkPackageJson() {

        try {
            const originalPJSON = fs.readJSONSync(this.pjsonFile);

            const fixedPJSON = _.clone(originalPJSON);

            const messages = [];

            const reactPeer = _.get(originalPJSON, ['peerDependencies', 'react']);
            if (_.isString(reactPeer) && reactPeer !== '*') {

                _.set(fixedPJSON, ['peerDependencies', 'react'], '*');

                messages.push('React peer dependency should be \'*\' and not \'{reactPeer}\' (auto-fixable)');
            }

            if (!_.isEmpty(messages)) {
                this.fixedPJSON = fixedPJSON;

                let PJSONMessage = 'The following problems are in this projects package.json:';
                _.map(messages, (message) => {
                    PJSONMessage += `\n\t${message}`;
                });

                this.messages.pjson = PJSONMessage;
            }

        } catch (e) {
            // no package.json found / unreadable
        }

    }

    checkNotExists(patterns) {

        this.deleteCandidates = _.union(
            this.deleteCandidates,
            globby.sync(patterns, {
                cwd: this.basedir,
                absolute: true,
            })
        );

        if (!_.isEmpty(this.deleteCandidates)) {
            let deleteCandidates = 'The following files should be deleted (auto-fixable):';
            _.map(this.deleteCandidates, (filePath) => {
                deleteCandidates += `\n\t${filePath}`;
            });

            this.messages.deleteCandidates = deleteCandidates;

        }

    }

    hasFixableProblems() {
        return !_.isEmpty(this.deleteCandidates) || !_.isNull(this.fixedPJSON);
    }

    hasProblems() {
        return this.hasFixableProblems() || !_.isEmpty(this.messages);
    }

    toString() {

        if (!this.hasProblems()) {
            return 'The doctor found no problems';
        }

        let result = 'The doctor found a few symptoms:';

        _.map(this.messages, function(message) {
            result += `\n\n${message}`;
        });

        if (this.hasFixableProblems()) {
            result += '\n\nSome (or all) of these problems can be fixed automatically.';
            result += '\nPlease run `gulp doctor --heal` to fix them.';
        }

        return result;

    }
}

module.exports = Doctor;
