I confirm that...

***General***

- [ ] the code is conform to our coding conventions ([?](https://confluence.brox.de/x/EIGOAQ))
    - **eslint does not fail**
    - works and performs its intended function
    - is free of any redundant or duplicate code
    - is as modular as possible
    - has no commented out code ([?](https://medium.com/@kentcdodds/please-don-t-commit-commented-out-code-53d0b5b26d5f))
    - has no code that can be replaced with library functions
- [ ] dependencies
    - are up to date
    - necessary, if new (check other components to avoid duplicate code) 

... changes are described ...

- [ ] in CHANGELOG.md
- [ ] in README.md (migration notes)

***Testing***

- [ ] stores and helper functions are unit tested
- [ ] functions in multiple Browsers (esp. CSS fixes)
    - Chrome
    - Firefox
    - IE 11 ([?](https://confluence.brox.de/x/FYISAw))

***Code Documentation***

- [ ] the code is documented properly
    - contains comments that describe the intent of the code
    - the code has comments on public methods/functions
    - thrown (runtime) exceptions are documented
    - every unusual behavior or edge-case handling is described
    - the use and function of third-party libraries is documented
    - complex algorithms are explained and justified
    - data structures and units of measurement are explained
    - outdated comments have been removed/updated
- [ ] the code does not contain any **TODO**s
- [ ] **FIXME**s were checked

*Template version 1.6.0*
