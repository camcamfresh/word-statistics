# Tool Application Report

## Code Clone Detection
Code clones were checked with two different methods. Both methods revealed no detectable clones within the source code.
- Using sonarqube demonstrated 0 duplicate code blocks within the source code of the project. See report at [sonarqube_snapshot.png](sonarqube_snapshot.png).
- Using jscpd we showed that 0 clone regions were detected in the source code. Run `npm run clone` to see results.

Exaple jscpd output:
```bash
$ npm run clone

> word-statistics@0.1.0 clone
> jscpd --pattern 'src/**/*.jsx'

Detection time:: 0.213ms
```

## Static Bug Detection
Static bug detection was performed with sonarqube. A screenshot of the latest run (shown at [sonarqube_snapshot.png](sonarqube_snapshot.png)) reveals that 0 bugs, code smells, and vulnerabilities were detected in the source code. It also indicates that over 367 lines were scanned with a overall coverage percentage of 96.1%.

## Other Tools Used
- jest
- babel
- react-scripts
- eslint
- prettier
- bootstrap css
- webpack
- sonarqube-scanner
