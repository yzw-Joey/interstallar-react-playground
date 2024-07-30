import { transform } from "@babel/standalone";
import { Files, File } from "../PlaygroundContext";
import { PluginObj } from "@babel/core";
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME } from "../files";

export const preTransformCode = (filename: string, code: string) => {
  let _code = code;
  const regexReact = /import\sReact/g;

  if (
    (filename.endsWith(".tsx") || filename.endsWith(".jsx")) &&
    !regexReact.test(code)
  ) {
    _code = `import React from 'react'; \n${code}`;
  }
  return _code;
};

export const babelTransform = (
  filename: string,
  code: string,
  files: Files
) => {
  let _code = preTransformCode(filename, code);
  let result = "";
  try {
    result = transform(_code, {
      presets: ["react", "typescript"],
      filename,
      plugins: [customResolver(files)],
      retainLines: true,
    }).code!;
  } catch (e) {
    console.error("Compile Error", e);
  }
  return result;
};

const getModuleFile = (files: Files, modulePath: string) => {
  let moduleName = modulePath.split("./").pop() || "";
  if (!moduleName.includes(".")) {
    const realModuleName = Object.keys(files)
      .filter((fileName) => {
        return (
          fileName.endsWith(".ts") ||
          fileName.endsWith(".tsx") ||
          fileName.endsWith(".js") ||
          fileName.endsWith(".jsx")
        );
      })
      .find((fileName) => fileName.split(".").includes(moduleName));
    if (realModuleName) moduleName = realModuleName;
  }

  return files[moduleName];
};

const json2JS = (file: File) => {
  const js = `export default ${file.value}`;
  return URL.createObjectURL(
    new Blob([js], { type: "application/javascript" })
  );
};

const css2Js = (file: File) => {
  const randomId = new Date().getTime();
  const js = `
(() => {
  const stylesheet = document.createElement('style')
  stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
  document.head.appendChild(stylesheet)

  const styles = document.createTextNode(\`${file.value}\`)
  stylesheet.innerHTML = ''
  stylesheet.appendChild(styles)
})()
  `;
  return URL.createObjectURL(
    new Blob([js], { type: "application/javascript" })
  );
};

export const customResolver = (files: Files): PluginObj => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value;
        if (modulePath.startsWith(".")) {
          const file = getModuleFile(files, modulePath);
          if (!file) return;
          if (file.name.endsWith(".css")) {
            path.node.source.value = css2Js(file);
          } else if (file.name.endsWith(".json")) {
            path.node.source.value = json2JS(file);
          } else {
            path.node.source.value = URL.createObjectURL(
              new Blob([babelTransform(file.name, file.value, files)], {
                type: "application/javascript",
              })
            );
          }
        }
      },
    },
  };
};

export const compile = (files: Files) => {
  const main = files[ENTRY_FILE_NAME];

  return babelTransform(ENTRY_FILE_NAME, main.value, files);
};
