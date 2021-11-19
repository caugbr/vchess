
export class Translate {

    constructor(lang, defaultLang = 'en') {
        this.navigatorLang = (navigator.language || navigator.userLanguage).toLowerCase().replace('_', '-');
        this.defaultLang = defaultLang;
        this.fetch();
        this.setLang(lang);
    }

    fetch() {
        this.translations = {};
        const context = require.context('./', false, /\.json$/);
        context.keys().forEach(key => {
            const fileName = key.replace('./', '');
            const resource = require(`./${fileName}`);
            const lang = fileName.replace(/\.[^.]+$/, '');
            this.translations[lang] = JSON.parse(JSON.stringify(resource));
        });
    }

    getLangs = () => {
        return Object.keys(this.translations);
    }
    
    setLang = lang => {
        this.lang = lang ?? this.navigatorLang;
        this.strings = this.translations[this.lang] ?? this.translations[this.defaultLang] ?? {};
    };

    t = txt => this.strings[txt] ?? txt;

    tl = (txt, lang) => {
        let str;
        try {
            str = this.translations[lang][txt] ?? txt;
        } catch(e) {
            str = txt;
        }
        return str;
    };

    langName = lang => {
        const ln = this.tl("language_name", lang);
        if ("language_name" === ln) {
            return lang;
        }
        return ln;
    }

}

// Vue plugin
const I18n = {
    install(Vue) {
        Vue.prototype.i18n = new Translate();
    }
};

export default I18n;