const { bootstrap } = require('./bootstrap');

describe('test logged out behavior', () => {
    let extPage, appPage, browser;

    beforeAll(async () => {
        const context = await bootstrap({ appUrl: 'http://localhost:3000', extensionPage: 'logged_out.html' /*, slowMo: 50, devtools: true*/ });

        extPage = context.extPage
        appPage = context.appPage
        browser = context.browser
    });

    it('should render sign-up / sign-in links', async () => {
        await extPage.bringToFront()
        const signUpButton = await extPage.$('a#sign-up-button')
        await signUpButton.click()

        const signUpTarget = await browser.waitForTarget(target => target.opener() === extPage.target())
        const signUpPage = await signUpTarget.page();

        expect(signUpPage.url()).toMatch("https://everypost.in/features/")

        await signUpPage.close()
    });

    it('should render sign-in link', async () => {
        await extPage.bringToFront()
        const signInLink = await extPage.$('a#sign-in-link')
        await signInLink.click()

        const signInTarget = await browser.waitForTarget(target => target.opener() === extPage.target())
        const signInPage = await signInTarget.page();
        expect(signInPage.url()).toMatch("https://everypost.in/users/sign_in")

        await signInPage.close()
    });

    afterAll(async () => {
        await browser.close();
    });
});