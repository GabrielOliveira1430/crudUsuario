export class BichoScraper {

  static async fetchBicho() {
    try {

      console.log('⚠️ BichoScraper: usando mock temporário');

      const mock = [
        { dezena: 1111, grupo: 1, animal: 'Avestruz' },
        { dezena: 2222, grupo: 2, animal: 'Águia' }
      ];

      const draws = mock.map((item: any) => ({
        number: String(item.dezena).padStart(4, '0'),
        source: 'jogo-do-bicho',
        extractedAt: new Date(),
        metadata: {
          grupo: item.grupo,
          animal: item.animal
        }
      }));

      return {
        success: true,
        total: draws.length,
        draws
      };

    } catch (error) {

      return {
        success: false,
        total: 0,
        draws: []
      };
    }
  }
}