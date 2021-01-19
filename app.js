const configs = {
  Notes: {
    name: "Notes",
    sections: {
      head: "head.html",
      note: "note.html",
      chart: "chart.html"
    }
  },
  DevResume: {
    name: "DevResume",
    sections: {
      head: "head.html",
      header: "header.html",
      item: "item.html",
      section: "section.html",
      summary: "summary.html"
    }
  }
}
const dir = 'templates/';

const onEdit = (content, template, config) => {
  preview = compile(content, template, config);
  document.getElementById("preview").srcdoc = preview;
}

const init = async (config) => {
  let template = await initTemplate(config, dir)
  
  const editor = document.getElementById("editor")
  editor.addEventListener("input", (event) => {
    let content = event.target.value;
    onEdit(content, template, config)
  })
  
  let content = await fetch(dir + config.name + '/default.rmk').then((resp) => resp.text())
  editor.value = content
  onEdit(content, template, config)
}

// init(configs.DevResume)
init(configs.Notes)
