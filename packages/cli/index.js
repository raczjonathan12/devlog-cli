const { program } = require('commander');
const child = require('child_process');
program.name("devlog-cli").
description("A CLI designed for generating professional devlogs for the Stardance challenge").
version("1.0.0");

program.command('gen').
description("Generate a new devlog based on your git commits").
option('-n ,--note <text>', 'Add context about this session').
action(async (options) => {
    const logs = child.execSync('git log --pretty=format:"%H|%s|%ad"', { encoding:'utf-8' }).split('\n');
    const parsedLogs = logs.map((line) => {const values = line.split('|'); return { hash: values[0], message: values[1], date: values[2], stats: child.execSync(`git show --stat ${values[0]}`, { encoding:'utf-8' }).split('\n').filter((stat) => {
        if (stat.startsWith("commit ") || stat.startsWith("Author:") || stat.startsWith("Date:") || stat.trim() === "") {
            return false;
        } else {
            return true;
        };
    })}});
    const respose = await fetch("http://localhost:3000/generate", {method: 'Post', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ commits: parsedLogs, note: options.note })});
    const text = await respose.text();
    console.log(text)
});

program.parse()
