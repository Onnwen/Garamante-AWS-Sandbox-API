const {Octokit} = require("@octokit/rest");
const getMonthName = require('../helpers/dates');
const {exec} = require("child_process");
const fs = require("fs");

async function getAll() {
    const auth = new Octokit({
        auth: fs.readFileSync('token.txt', 'utf8').toString()
    })

    const request = await auth.request('GET /repos/{owner}/{repo}/branches{?protected,per_page,page}', {
        owner: 'Onnwen',
        repo: 'Garamante-AWS-Sandbox'
    })

    const branchesInfo = request.data;
    let branches = [];

    branchesInfo.forEach(branch => {
        if (branch.name !== "main") {
            const branchInfo = branch.name.split("_");
            const branchTitle = branchInfo[2];
            const dayValues = branchInfo[1].split("-");
            const branchDate = new Date(dayValues[2], Number(dayValues[1]) - 1, dayValues[0]);
            const branchDateFormatted =dayValues[0] + " " + getMonthName(dayValues[1]) + " " + dayValues[2];
            const branchCategories = branchInfo[0].split(",");

            branches.push({
                title: branchTitle,
                name: branch.name,
                description: branch.description,
                date: branchDate,
                formattedDate: branchDateFormatted,
                fileName: branchTitle,
                tags: branchCategories
            });
        }
    });

    branches.sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
    });

    branches.forEach(branch => {
        branch.tags.forEach((tag, index) => {
            switch (tag.toUpperCase()) {
                case "ANGULAR":
                    branch.tags[index] = {"firstColor": "#f12711", "secondColor": "#f5af19", "name": "Angular"};
                    break;
                case "PHP":
                    branch.tags[index] = {"firstColor": "#6a3093", "secondColor": "#a044ff", "name": "PHP"};
                    break;
                case "JQUERY":
                    branch.tags[index] = {"firstColor": "#56ab2f", "secondColor": "#a8e063", "name": "jQuery"};
                    break;
                case "TYPESCRIPT":
                    branch.tags[index] = {"firstColor": "#2F80ED", "secondColor": "#56CCF2", "name": "TypeScript"};
                    break;
                case "BOOTSTRAP":
                    branch.tags[index] = {"firstColor": "#563d7c", "secondColor": "#563d7c", "name": "Bootstrap"};
                    break;
                case "HTML":
                    branch.tags[index] = {"firstColor": "#021B79", "secondColor": "#0575E6", "name": "HTML"};
                    break;
                case "JAVA":
                    branch.tags[index] = {"firstColor": "#CAC531", "secondColor": "#b7ab00", "name": "Java"};
                    break;
                case "XML":
                    branch.tags[index] = {"firstColor": "#ED213A", "secondColor": "#93291E", "name": "XML"};
                    break;
                default:
                    branch.tags[index] = {"firstColor": "#232526", "secondColor": "#414345", "name": tag};
                    break;
            }
        });
    });

    return branches;
}

async function loadAll() {
    exec("rm -r works && mkdir works", (error, stdout, stderr) => {
        if (error || stderr) {
            console.log(`error: ${error.message}`);
        }

        getAll().then(branches => {
            branches.forEach(branch => {
                exec("cd works && mkdir " + branch.fileName + "; cd " + branch.fileName + " && git clone https://github.com/Onnwen/Garamante-AWS-Sandbox.git . && git checkout " + branch.name + " && git pull", (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
            });
        });
    });
}

module.exports = {
    getAll,
    loadAll
}