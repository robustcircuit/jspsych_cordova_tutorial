const languages = ['english', 'french']; // hardcoded list
const modules = {};

for (const lang of languages) {
  const module = await import(`./lang.${lang}.js`);
  modules[lang] = module.default || module;
}