const { program } = require('commander');
const child = require('child_process');
program.name("devlog-cli").description("A CLI designed for generating professional devlogs for the Stardance challenge").version("1.0.0");

program.command('gen').
description("Generate a new devlog based on your git commits").
action(() => {
    const logs = child.execSync('git log --pretty=format:"%H|%s|%ad"', { encoding:'utf-8' }).split('\n');
    const parsedLogs = logs.map((line) => {const values = line.split('|'); return { hash: values[0], message: values[1], date: values[2] }})
    console.log(parsedLogs)
});
program.parse()
