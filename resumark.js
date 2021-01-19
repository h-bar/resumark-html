Handlebars.registerHelper("markdown", function(text) {
  return new Handlebars.SafeString(marked(text));
});

var asciidoctor = Asciidoctor()
Handlebars.registerHelper("asciidoc", function(text) {
  return new Handlebars.SafeString(asciidoctor.convert(text));
});

function parse(text, identifier, delimiter) {
    text = '\n' + text;
    var lines = text.split(identifier).map((line) => line.trim());
  
    var tokenized = {};
    lines.forEach((line) => {
      var token = line.substr(0, line.indexOf(delimiter));
      if (token === '###') {
        throw new Error('Token ### is reserved. Use it for indicating templates only');
      }
      if (token === delimiter) {
        throw new Error('Token ' + delimiter + ' is reserved. Use it as delimiter only');
      }
      var content = line.substr(line.indexOf(delimiter)+1).trim();
      if (!(token in tokenized)) {
        tokenized[token] = [];
      }
      tokenized[token].push(content);
    });
    console.log(tokenized)
    return tokenized;
}

function compile(content, template, config) {
    if (!template.head) return '';
  
    var identifier = '###';
    var delimiter = '\n';
    var sections = content.split(identifier).map((section) => section.trim());
    
    var rendered = template.head({
      css_link: ['templates/' + config.name + '/' + config.name + '.css']
    });

    rendered += '<div class=content-wrapper>';
  
    sections.forEach((section) => {
      var sectionName = section.substr(0, section.indexOf(delimiter));
      if (sectionName === '') return;
  
      var content = section.substr(section.indexOf(delimiter)+1).trim();
      content = parse(content, '\n.', ' ');
  
      if (sectionName in template) rendered += template[sectionName](content);
    });
    
    // console.log(rendered)
    rendered += '</div>';
    
    // console.log(rendered)
    return rendered;
  }

async function initTemplate(config, dir) {
    var template = [];
    for (var section in config.sections) {
        var content = await (await fetch(dir + config.name + '/' + config.sections[section])).text();
        template[section] = Handlebars.compile(content);
    }

    return template;
}