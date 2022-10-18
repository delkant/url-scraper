import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';

@Injectable()
export class ScraperService {
  async getPage(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage(); //open a new page
    await page.goto(url); //access the page
    return page;
  }
  
  async scrape(url: string) {
    const page = await this.getPage(url);
    const title = await this.getTitle(page);
    const metadata = await this.getMetas(page);

    return { title, metadata };
  }

  async getTitle(page: Page) {
    return page?.title() || '';
  }

  async getMetas(page: Page) {
    if (!page) return [];

    const list = await page.evaluate(() =>
      Array.from(document.querySelectorAll('meta'), (m: HTMLMetaElement) => {
        return m.getAttributeNames().reduce((acc, name) => {
          return { ...acc, [name]: m.getAttribute(name) };
        }, {});
      }),
    );

    return list;
  }
}
