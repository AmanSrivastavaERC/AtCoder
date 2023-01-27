import axios from 'axios';
import cheerio from 'cheerio';
import chalk from 'chalk';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function getId() {
    return new Promise(resolve => rl.question("Contest Id: ", input => resolve(input)));
}

async function getUser() {
    return new Promise(resolve => rl.question("Username: ", input => resolve(input)));
}

function getString(problems) {
    return problems.map((problem, i) => (i > 0 && i % 5 === 0 ? `\n ${problem} ` : ` ${problem} `)).join('');
}

async function getProblems() {
    try {
        const contestId = await getId();
        const user = await getUser();
        const contestURL = `https://atcoder.jp/contests/${contestId}/tasks`;
        const contestRes = await axios.get(contestURL);
        const contest$ = cheerio.load(contestRes.data);
        const contestProblems = [];

        contest$('.table-responsive tbody tr').each((index, element) => {
            let problemId = contest$(element).find('td a').text().trim();
            let problemName = problemId.substring(1);
            problemId = contestId + "_" + problemId.charAt(0).toLowerCase();
            contestProblems.push({ problemId, problemName });
        });

        const userRes = await axios.get(`https://kenkoooo.com/atcoder/atcoder-api/results?user=${user}`);
        const userProblems = userRes.data;
        let ac = [], wa = [], ns = [];

        contestProblems.forEach(problem => {
            let userProblem = userProblems.find(userProblem => userProblem.problem_id === problem.problemId);
            if (userProblem) {
                if (userProblem.result === 'AC') {
                    ac.push(problem.problemName);
                } else {
                    wa.push(problem.problemName);
                }
            } else {
                ns.push(problem.problemName);
            }
        });
        const acc = chalk.green.underline.bold("ACCEPTED\n");
        const was = chalk.red.underline.bold("WRONG ANSWER\n");
        const uns = chalk.yellow.underline.bold("UNSOLVED\n");
        console.log(acc + chalk.green.bold(getString(ac)));
        console.log(was + chalk.red.bold(getString(wa)));
        console.log(uns + chalk.yellow.bold(getString(ns)));

    } catch (err) {
        console.log(err);
    } finally {
        rl.close();
    }
}

getProblems();
