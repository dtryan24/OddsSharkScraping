const puppeteer = require('puppeteer');
const fs = require('fs');

const nhl = [
    {
        team: "Anaheim",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16601"
    },
    {
        team: "Arizona",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16588"
    },
    {
        team: "Boston",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16579"
    },
    {
        team: "Buffalo",
        url: 'https://www.oddsshark.com/stats/gamelog/hockey/nhl/16580'
    },
    {
        team: "Calgary",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16605"
    },
    {
        team: "Carolina",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16600",
    },
    {
        team: "Chicago",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16585",
    },
    {
        team: "Colorado",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16587",
    },
    {
        team: "Columbus",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16603",
    },
    {
        team: "Dallas",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16595",
    },
    {
        team: "Detroit",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16581",
    },
    {
        team: "Edmonton",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16608"
    },
    {
        team: "Florida",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16593",
    },
    {
        team: "Los Angeles",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16602"
    },
    {
        team: "Minnesota",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16596"
    },
    {
        team: "Montreal",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16606",
    },
    {
        team: "Nashville",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16583"
    },
    {
        team: "New Jersey",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16598",
    },
    {
        team: "New York Islanders",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16592",
    },
    {
        team: "New York Rangers",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16586",
    },
    {
        team: "Ottawa",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16594",
    },
    {
        team: "Philadelphia",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16589",
    },
    {
        team: "Pittsburg",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16591",
    },
    {
        team: "St. Louis",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16599"
    },
    {
        team: "San Jose",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16584"
    },
    {
        team: "Tampa Bay",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16590",
    },
    {
        team: "Toronto",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16604",
    },
    {
        team: "Vancouver",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16582"
    },
    {
        team: "Vegas",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/125805"
    },
    {
        team: "Washington",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16607",
    },
    {
        team: "Winnipeg",
        url: "https://www.oddsshark.com/stats/gamelog/hockey/nhl/16597"
    },
];

let sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    });
};

let runScrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let i = 1;

    let num = Math.floor(Math.random()*1000);
    let name = `teamStats${num}.csv`;
    let colNames = `Team,Date,Year,Opponent,Type,Result,Score,Line,O/U,Total`;

    for (const team of nhl){

        await sleep(3000);
        console.log(`Getting ${team.team}'s stats`);
        await page.goto(team.url, {waitUntil: "networkidle0"});
        const teamStats = await page.evaluate(() => {

            let returnObj = [];
            const rows = document.getElementsByClassName('table table--striped table--fixed-column')[1].children[1].rows;

            for (const row of rows){

                const lastOne = row.children;

                let date = lastOne[0].innerText;
                let opponent = lastOne[1].innerText;
                let game = lastOne[2].innerText;
                let result = lastOne[3].innerText;
                let score = lastOne[4].innerText;
                let line = lastOne[5].innerText;
                let overUnder = lastOne[6].innerText;
                let total = lastOne[7].innerText;
                returnObj.push({
                    date: date,
                    opponent: opponent,
                    game: game,
                    result: result,
                    score: score,
                    line: line,
                    overUnder: overUnder,
                    total: total
                });
            }
            return returnObj;
        });

        let n = 1;

        for(let game of teamStats){
            let row = `${team.team},${game.date.replace(',', '')},${game.opponent},${game.game},${game.result}, ${game.score} , ${game.line},${game.overUnder},${game.total}`;
            await fs.appendFileSync(name, row + '\n', function (err) {
                if (err) throw err;
            });
            process.stdout.write(`${n}`);
        }

        await page.goto('about:blank');

        await fs.appendFileSync(name, '\n', function (err) {
            if (err) throw err;
        });
        console.log(`Got ${team.team} all finished`);
    }

    await page.close();
    await browser.close();
};

runScrape().then(
    () => {
        process.exit();
    }
);