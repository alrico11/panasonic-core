#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LIBRARY_API_PATH = path.resolve(PROJECT_ROOT, '../cakrawala-hub-library-api');
const LIBS_PATH = path.resolve(PROJECT_ROOT, 'libs');
const LIBS_INDEX = path.join(LIBS_PATH, 'index.js');

function run(cmd, cwd) {
    console.log(`> ${cmd}`);
    execSync(cmd, { cwd, stdio: 'inherit' });
}

function main() {
    if (fs.existsSync(LIBRARY_API_PATH)) {
        console.log('📦 Library source found, building from source...');

        run('npm run build', LIBRARY_API_PATH);

        if (!fs.existsSync(LIBS_PATH)) {
            fs.mkdirSync(LIBS_PATH, { recursive: true });
        }

        run(`npx cpx "${path.join(LIBRARY_API_PATH, 'dist', '**', '*')}" "${LIBS_PATH}"`, PROJECT_ROOT);

        console.log('✅ Library built and copied to libs/');
    } else {
        if (fs.existsSync(LIBS_INDEX)) {
            console.log('📦 Using pre-built library from libs/index.js');
            console.log('✅ No build needed');
        } else {
            console.error('❌ Error: No library source or pre-built library found!');
            console.error('   - Library source expected at:', LIBRARY_API_PATH);
            console.error('   - Pre-built library expected at:', LIBS_INDEX);
            process.exit(1);
        }
    }
}

main();
