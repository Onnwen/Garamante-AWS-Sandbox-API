const {Octokit} = require("@octokit/rest");
const getMonthName = require('../helpers/dates');
const {exec} = require("child_process");
const fs = require("fs");

async function getAll() {
    const auth = new Octokit({
        auth: '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'
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
            const branchDate = branchInfo[1];
            const branchDateFormatted = branchDate.split("-")[0] + " " + getMonthName(branchDate.split("-")[1]) + " " + branchDate.split("-")[2];
            const branchCategories = branchInfo[0].split(",");

            branches.push({
                title: branchTitle,
                name: branch.name,
                description: branch.description,
                date: branchDate,
                formattedDate: branchDateFormatted,
                fileName: (branchDate + "_" + branchTitle),
                categories: branchCategories
            });
        }
    });

    return branches;
}

async function loadAll() {
    exec("rm -r works && mkdir works", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);

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