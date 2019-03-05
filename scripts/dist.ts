import * as tar from 'tar'

const outputFile = 'bin/dist.tar.gz';

function tarBuildDir() {
    tar.c(
        {'gzip': true, 'file': outputFile},
        ['build'],
        () => {console.log('tarball created at ' + outputFile)}
    );
}

tarBuildDir();