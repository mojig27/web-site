// backend/src/services/content-filter.service.ts
export class ContentFilterService {
    private toxicityModel: any;
    private patternRules: RegExp[];
    private bannedWords: Set<string>;
  
    constructor() {
      this.loadModels();
      this.loadRules();
    }
  
    async analyze(text: string): Promise<{
      score: number;
      categories: string[];
      reason?: string;
    }> {
      const [
        toxicityAnalysis,
        patternMatches,
        wordMatches
      ] = await Promise.all([
        this.checkToxicity(text),
        this.checkPatterns(text),
        this.checkBannedWords(text)
      ]);
  
      const categories = [
        ...toxicityAnalysis.categories,
        ...patternMatches.categories,
        ...wordMatches.categories
      ];
  
      const score = Math.max(
        toxicityAnalysis.score,
        patternMatches.score,
        wordMatches.score
      );
  
      return {
        score,
        categories,
        reason: this.getReason(categories)
      };
    }
  
    private async checkToxicity(text: string) {
      const predictions = await this.toxicityModel.classify(text);
      
      const categories = [];
      let maxScore = 0;
  
      for (const [category, score] of Object.entries(predictions)) {
        if (score > 0.7) {
          categories.push(category);
          maxScore = Math.max(maxScore, score as number);
        }
      }
  
      return { score: maxScore, categories };
    }
  
    private checkPatterns(text: string) {
      const matches = this.patternRules
        .map(rule => ({ rule, match: text.match(rule) }))
        .filter(({ match }) => match);
  
      return {
        score: matches.length > 0 ? 0.8 : 0,
        categories: matches.map(m => m.rule.source)
      };
    }
  
    private checkBannedWords(text: string) {
      const words = text.toLowerCase().split(/\s+/);
      const matches = words.filter(word => this.bannedWords.has(word));
  
      return {
        score: matches.length > 0 ? 0.9 : 0,
        categories: matches
      };
    }
  
    private getReason(categories: string[]): string {
      const categoryMessages = {
        toxicity: 'محتوای خشونت‌آمیز',
        harassment: 'آزار و اذیت',
        'identity-attack': 'حمله به هویت',
        obscenity: 'محتوای نامناسب',
        'banned-word': 'استفاده از کلمات ممنوعه',
        'pattern-violation': 'الگوی نامناسب'
      };
  
      return categories
        .map(c => categoryMessages[c] || c)
        .join('، ');
    }
  
    private async loadModels() {
      // Load ML models
    }
  
    private loadRules() {
      // Load pattern rules and banned words
    }
  }