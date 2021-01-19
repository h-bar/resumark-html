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

function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);

  pom.style.display = 'none';
  document.body.appendChild(pom);
  pom.click();
  document.body.removeChild(pom);
}

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

  const fileLoder = document.getElementById("fileLoader");
  fileLoder.addEventListener('change', (event) => {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0], "UTF-8");
    reader.onloadend = ((event) => {
      let content = event.target.result;
      editor.value = content
      onEdit(content, template, config)
    })
  });

  document.getElementById("downloadBtn").addEventListener('click', (event) => {
    const file = fileLoder.files[0];
    let filename;
    if (file !== undefined) filename = file.name

    download(filename, editor.value)
  })

  let content = await fetch(dir + config.name + '/default.rmk').then((resp) => resp.text())
  editor.value = content
  onEdit(content, template, config)
}

// init(configs.DevResume)
init(configs.Notes)
