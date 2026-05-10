import axios from 'axios';
import * as cheerio from 'cheerio';

export class FederalProvider {

  static async fetchFederal() {
    try {

      console.log('📡 Scraper Federal REAL iniciando...');

      // ⚠️ página pública (estrutura pode variar, mas geralmente contém resultados)
      const url = 'https://loterias.caixa.gov.br/Paginas/Federal.aspx';

      const { data: html } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 10000
      });

      const $ = cheerio.load(html);

      const draws: any[] = [];

      // 🔍 tentativa 1: tabela de resultados
      $('.resultado-loteria tbody tr').each((_, el) => {

        const cols = $(el).find('td');

        const premio = $(cols[0]).text().trim();
        const numero = $(cols[1]).text().trim();

        if (numero) {
          draws.push({
            number: String(numero).padStart(4, '0'),
            source: 'federal',
            extractedAt: new Date(),
            metadata: {
              premio,
              raw: numero
            }
          });
        }
      });

      // 🔍 fallback: outra estrutura possível da Caixa
      if (draws.length === 0) {

        $('.lista-de-premios li').each((_, el) => {

          const text = $(el).text().trim();

          const match = text.match(/(\d{4,5})/);

          if (match) {
            draws.push({
              number: match[1].padStart(4, '0'),
              source: 'federal',
              extractedAt: new Date(),
              metadata: {
                raw: text
              }
            });
          }
        });
      }

      // 🔍 fallback final
      if (draws.length === 0) {
        console.log('⚠️ Scraper não encontrou estrutura conhecida');
      }

      console.log(`🟢 Federal scraper real: ${draws.length} itens`);

      return {
        success: draws.length > 0,
        total: draws.length,
        draws
      };

    } catch (error: any) {

      console.error('🔴 Erro Federal Scraper:', error.message);

      return {
        success: false,
        total: 0,
        draws: []
      };
    }
  }
}