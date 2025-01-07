import fetch from 'node-fetch';
import  generate_from_text_input from './vertex.js'
import { config } from 'dotenv';
config();

import pkg_l from 'lodash';
const { find, findKey } = pkg_l;


const language = 'nl'


import puppeteer from 'puppeteer';

let news_content = []
let browser = ''

import {
	GetPrompt
} from '$lib/server/db.admin.js';

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Добавляем 0, если месяц < 10
    const day = String(date.getDate()-1).padStart(2, '0'); // Добавляем 0, если день < 10
    return `${year}-${month}-${day}`;
};


export default async function generate_news(){
    let data = await GetPrompt('news');
    const date = formatDate(new Date());
    let prompt = data.prompt.system;
 
    prompt = prompt.replace(/\$\{date\}/g, date );
    const articles = await getRSSNews('https://www.vrt.be/vrtnws/nl/regio/antwerpen');//'Belgium', language);
    return;
    let content = articles.map((item)=>{
        return item.content
    });
    console.log(JSON.stringify(content))
    if (articles.length > 0) {
        // console.log("\n--- Получены новости ---");
        // for (const [i, article] of articles.entries()) {
        //     console.log(`${i + 1}. ${article.title}`);
        // }
        // console.log("\n--- Анализ тональности статей (упрощенный пример)---");

        //  for (const [i, article] of articles.entries()) {
        //     const textContent = article.description || article.content || "";
        //     if (textContent) {
        //       const sentiment = await analyzeSentiment(textContent);
        //       console.log(`${i + 1}. Tональность: ${sentiment}`);
        //     }
        //  }
    } else {
        console.log("Нет новостей для отображения.");
    }
    data = generate_from_text_input( `Адаптировать для B1.1 форматировать в html: ${JSON.stringify(content)}`);
}


async function getRSSNews(url, content = 'link', newsContent = [], browser = null) {
    const feedUrl = url;
  
    // Открываем браузер, если он ещё не открыт
    if (!browser) {
      browser =  await puppeteer.launch({ headless: true });
    }
  
    let page;
    try {
      page = await browser.newPage();
      await page.goto(feedUrl, { waitUntil: 'domcontentloaded' });
  
      if (content === 'link') {
        // Извлечение ссылок новостей
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a[href*="2025/01/07"]')).map(h => h.href.trim());
        });
  
        console.log('Найдено ссылок:', links);
  
        // Асинхронно обрабатываем каждую ссылку
        for (const link of links) {
          await getRSSNews(link, 'content', newsContent, browser);
        }
      } else {
        // Извлечение контента
        const content = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.cmp-text')).map(t => t.innerText.trim());
        });
  
        newsContent.push({ url, content });
        console.log(`Контент из ${url}:`, content);
      }
  
    } catch (error) {
      console.error('Ошибка при обработке страницы:', error);
    } finally {
      if (page) {
        try {
          await page.close(); // Закрытие страницы
        } catch (error) {
          console.error('Ошибка при закрытии страницы:', error);
        }
      }
    }
  
    // Закрытие браузера, если это последний вызов
    try {
      if (browser.isConnected()) {
        await browser.close();
      }
    } catch (error) {
      console.error('Ошибка при закрытии браузера:', error);
    }
  
    return newsContent;
  }


