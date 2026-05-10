import { BrasilApiProvider } from '../providers/brasil-api.provider';
import { FederalProvider } from './federal.provider';
import { BichoScraper } from './bicho.scraper';

export class ExternalDrawBootstrap {

  static init() {

    console.log('🚀 External Draw Bootstrap ativado');

    // 🔁 override sem mexer no sistema original
    (BrasilApiProvider as any).fetchMegaSena = async () => {

      console.log('🔄 Fonte substituída por FEDERAL');

      const federal = await FederalProvider.fetchFederal();

      // fallback automático
      if (federal.success && federal.draws.length > 0) {
        return federal;
      }

      console.log('⚠️ Federal falhou, usando Bicho');

      return await BichoScraper.fetchBicho();
    };
  }
}