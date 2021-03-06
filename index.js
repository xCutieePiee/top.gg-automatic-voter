const puppeteer = require('puppeteer');
const { BOTS, COOKIE } = require('./config.json');
const logger = require('./logger.js');

if (!BOTS) return logger.err('Config BOTS is missing');
if (!COOKIE) return logger.err('Config COOKIE is missing');

function vote() {
	BOTS.forEach(async b => {
	logger.try(`Trying to vote for ${b.name}...`);

	const browser = await puppeteer.launch({ headless: false, args: ['--window-size=0,300'] });
	const page = (await browser.pages())[0];

	await page.setCookie({ name: 'connect.sid', value: COOKIE, domain: 'top.gg', path: '/' });
	await page.goto(`https://top.gg/bot/${b.id}/vote`);
	await page.click('#votingvoted');

	logger.succ(`Successfully voted for ${b.name}!`);

	setTimeout(() => browser.close(), 1000);
	if(b.id == BOTS[BOTS.length-1].id) {
	setTimeout(() => { //to make sure every vote finished
	setTimeout(vote, 1000 * 60 * 60 * 12);
	logger.info('Waiting 12 hours');
	}, 5000);
	}
});
}
vote();