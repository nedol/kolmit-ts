import fetch from 'node-fetch';
import  generate_from_text_input from './vertex.js'
import { config } from 'dotenv';
config();

import pkg_l from 'lodash';
const { find, findKey } = pkg_l;

import NewsAPI from 'newsapi'

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const language = 'nl'

const newsapi = new NewsAPI(NEWS_API_KEY);

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
      browser =  await puppeteer.launch({ headless: false });
    }
  
    let page;
    try {
      page = await browser.newPage();
      await page.goto(feedUrl, { waitUntil: 'domcontentloaded' });
  
      if (content === 'link') {
        // Извлечение ссылок новостей
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a[href*="2025/01/05"]')).map(h => h.href.trim());
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
// --- STEP 1: Получение новостей ---
const newsApiUrl = "https://newsapi.org/v2/everything";

async function getNews(query = "Бельгия", language = "nl", pageSize = 5) {
    const params = {
        language: language,
        apiKey: NEWS_API_KEY,
        pageSize: pageSize,
        country:'be',
        category:'general'
    };

    try {
        // const response = await fetch(newsApiUrl + '?' + new URLSearchParams(params));
        // To query /v2/everything
        // You must include at least one q, source, or domain
        newsapi.v2.everything({
            q: 'general',
            sources: 'vrt.be',
            domains: 'vrt.be',
            from: '2025-01-01',
            to: '2025-01-05',
            language: language,
            sortBy: 'relevancy',
            page: 5
        }).then(response => {
            console.log(response);
            /*
            {
                status: "ok",
                articles: [...]
            }
            */
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error("Error getting news:", error);
        return [];
    }
}


