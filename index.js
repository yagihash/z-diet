const puppeteer = require('puppeteer')
const url = 'https://account.withings.com/connectionwou/account_login?r=https%3A%2F%2Fhealthmate.withings.com%2F'
const username = process.env.username
const password = process.env.password
const secret = process.env.secret

const updateWeight = async (weight) => {
    const opt = {
        headless: true,
        args: [
            "--disable-background-networking",
            "--disable-default-apps",
            "--disable-extensions",
            "--disable-gpu",
            "--disable-sync",
            "--disable-translate",
            "--hide-scrollbars",
            "--metrics-recording-only",
            "--mute-audio",
            "--no-first-run",
            "--safebrowsing-disable-auto-update",
        ],
    }

    const browser = await puppeteer.launch(opt)
    const page = await browser.newPage()

    await page.goto(url, {
        waitUntil: 'networkidle2',
    })

    // Login
    await page.click('body > div.cookieBar.active > div > button')
    await page.type('#signin > div > div.col-xs-12.col-sm-6.col-md-4.col-lg-3.sidebar > div.contentForm > form > div:nth-child(1) > input', username)
    await page.type('#signin > div > div.col-xs-12.col-sm-6.col-md-4.col-lg-3.sidebar > div.contentForm > form > div:nth-child(2) > input', password)
    await page.click('#signin > div > div.col-xs-12.col-sm-6.col-md-4.col-lg-3.sidebar > div.contentForm > form > div.createButton > button')

    // Open weight history page
    await page.waitFor('#timeline-summary-sticky > div.summary-list > div > div:nth-child(1) > div.details')
    await page.click('#timeline-summary-sticky > div.summary-list > div > div:nth-child(1) > div.details')

    // Open dialog to input weight log
    await page.waitFor('#weight-content > div > div.addbutton')
    await page.click('#weight-content > div > div.addbutton')

    // Input weight and save
    await page.waitFor('#weight-add > form > div.weight-and-mass > div:nth-child(1) > div.value.focus-weight > input')
    await page.type('#weight-add > form > div.weight-and-mass > div:nth-child(1) > div.value.focus-weight > input', weight)
    await page.click('#sidepanel-wrapper-header > div > ul > li > span')

    // Wait for update to be sure
    await page.waitFor(1000)

    await browser.close()
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.main = (req, res) => {
    if (req.headers['x-secret'] !== secret) {
        res.status(403).send('forbidden')
    }

    let weight = req.query.w || null
    if (weight) {
        res.status(400).send('bad request')
    }

    updateWeight(weight).then(() => {
        res.status(200).send('ok');
    }).catch(() => {
        res.status(500).send('internal server error');
    })
};

