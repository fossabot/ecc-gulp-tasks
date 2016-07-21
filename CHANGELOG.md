# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and [Keep A Changelog's Format](http://keepachangelog.com/).

## [2.3.0] 2016-06-23 
### Added
- Added `__DEBUG__` Flag which is set to true while running `gulp debug`.
`gulp build-app` will strip all `__DEBUG__` flags while `gulp build` leaves them be.

### Changed
- Refactored tests around building of components

## [2.2.0] 2016-06-20 
### Added
- Case Sensitivity Check during Builds to prevent failing builds from case insensitive file systems.

## [v2.1.0] - 2016-05-24

### Added
- Added `licenses-yaml2json` target for converting license YAML files to license json files

### Deprecated
- `licenses` target should be replaced with newly added `licenses-yaml2json`