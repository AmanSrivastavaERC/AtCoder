import axios from 'axios';
import cheerio from 'cheerio';
import chalk from 'chalk';
let contestId = 'dp';
let contestURL = `https://atcoder.jp/contests/${contestId}/tasks`;
let user = 'AmanSrivastava';

async function getProblems() {
    try {
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
        let ac = [],wa=[],ns=[];
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
        let a = "", b = "", c = "";
        for (let i = 0; i < ac.length; i++) {
            a += " " + ac[i] + " ";
            if (i > 0 && i % 5 == 0 && i != ac.length - 1) a += "\n";
        }
        for (let i = 0; i < wa.length; i++) {
            b += " " + wa[i] + " ";
            if (i > 0 && i % 5 == 0 && i != wa.length - 1) b += "\n";
        }
        for (let i = 0; i < ns.length; i++) {
            c += " " + ns[i] + " ";
            if (i > 0 && i % 5 == 0 && i != ns.length - 1) c += "\n";
        }
        console.log(chalk.green.bold(a)+"\n");
        console.log(chalk.red.bold(b)+"\n");
        console.log(chalk.yellow.bold(c));
    } catch (err) {
        console.log(err);
    }
}
getProblems();
