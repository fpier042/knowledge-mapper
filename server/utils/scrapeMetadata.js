import * as cheerio from 'cheerio';
import axios from 'axios';

async function scrapeMetadata(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const metadata = {
      title: $('title').text() || $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[name="description"]').attr('content') || 
                  $('meta[property="og:description"]').attr('content') || '',
      favicon: $('link[rel="icon"]').attr('href') || 
              $('link[rel="shortcut icon"]').attr('href') || '/favicon.ico'
    };

    return metadata;
  } catch (error) {
    console.error('Error scraping metadata:', error);
    return {
      title: '',
      description: '',
      favicon: '/favicon.ico'
    };
  }
}

export default scrapeMetadata;