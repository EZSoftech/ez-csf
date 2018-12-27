'use strict';
let gulp = require('gulp');
let del = require('del');
let tslint = require('gulp-tslint');
let nodemon = require('gulp-nodemon');
let ts = require('gulp-typescript');
let sourcemaps = require('gulp-sourcemaps');
let lodash = require('lodash');

const BUILD_PATH = 'dist';
const APP_BUILD_PATH = BUILD_PATH + '/src';
const TEST_BUILD_PATH = BUILD_PATH + '/test';
const UNIT_TEST_BUILD_PATH = TEST_BUILD_PATH + '/unit';
const INTEGRATION_TEST_BUILD_PATH = TEST_BUILD_PATH + '/integration';

const STATIC_APP_GLOB = ['src/**/*.yaml'];

const SRC_FILE_GLOB = ['src/**/*.ts', 'typings/index.d.ts', 'custom_typings/index.d.ts'];

const UNIT_TEST_GLOB = ['test/unit/**/*.spec.ts', 'test/unit/**/*-helper.ts', 'typings/index.d.ts', 'custom_typings/index.d.ts'];
const INTEGRATION_TEST_GLOB = ['test/integration/**/*.ts', 'typings/index.d.ts', 'custom_typings/index.d.ts'];
const TEST_GLOB = lodash.union(UNIT_TEST_GLOB, INTEGRATION_TEST_GLOB);

const TS_PROJECT = ts.createProject('tsconfig.json');
const COVERAGE = 'coverage';

gulp.task('default', ['build']);

gulp.task('server', ['build'], () => {
    nodemon({
        script: 'bin/www',
        watch: ['src/'],
        ext: 'ts json yaml',
        tasks: ['build'],
        env: {
            NODE_ENV: process.env.NODE_ENV || 'development'
        },
        legacyWatch: true
    });
});

gulp.task('build', ['clean', 'tslint'], () => {
    gulp.src(STATIC_APP_GLOB)
        .pipe(gulp.dest(APP_BUILD_PATH));
    let v =  gulp.src(SRC_FILE_GLOB)
        .pipe(sourcemaps.init())
        .pipe(TS_PROJECT());
        v.js.pipe(sourcemaps.write('.', {
            includeContent: false,
            mapSources: (path) => {
                let depth = path.split(/[/,\\]/).length - 2;
                if (depth >= 0) {
                    return '../'.repeat(depth) + path;
                } else {
                    return path;
                }
            }
        }))
        .pipe(gulp.dest(APP_BUILD_PATH));
        v.dts.pipe(gulp.dest('build/src'));
        return v;
});

gulp.task('clean', ['clean-coverage'], () => {
    return del.sync(APP_BUILD_PATH + '/**/*');
});

gulp.task('tslint', () => {
    return gulp.src(SRC_FILE_GLOB)
        .pipe(tslint({
            configuration: './tslint.json'
        }))
        .pipe(tslint.report({
            emitError: true,
            summarizeFailureOutput: true
        }))
});

gulp.task('clean-coverage', () => {
    return del.sync(COVERAGE + '/**/*');
});
