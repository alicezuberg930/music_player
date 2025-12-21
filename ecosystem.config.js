module.exports = {
    apps: [
        {
            name: 'services',
            cwd: __dirname,
            script: 'bun',
            args: [
                'run',
                'dev:api',
            ],
            exec_mode: 'fork',
        },
        {
            name: 'web',
            cwd: __dirname,
            script: 'bun',
            args: [
                'run',
                'dev:web',
            ],
            exec_mode: 'fork',
        }
    ],
};
