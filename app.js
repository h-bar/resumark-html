const config = {
  name: "DevResume",
  sections: {
    head: "head.html",
    header: "header.html",
    item: "item.html",
    section: "section.html",
    summary: "summary.html"
  }
}
const dir = 'templates/';

const onEdit = (content, template) => {
  preview = compile(content, template);
  document.getElementById("preview").srcdoc = preview;
}

const init = async () => {
  let template = await initTemplate(config, dir)
  
  const editor = document.getElementById("editor")
  editor.addEventListener("input", (event) => {
    let content = event.target.value;
    onEdit(content, template)
  })
  
  let content = await fetch(dir + config.name + '/default.rmk').then((resp) => resp.text())
  editor.value = content
  onEdit(content, template)
}

init()
