import { join } from 'path';
import { smartOutputFile } from '../common';
import { CSS_LANG, getCssBaseFile } from '../common/css';
import { SRC_DIR, STYPE_DEPS_JSON_FILE } from '../common/constant';

type Options = {
  outputPath: string;
  pathResolver?: Function;
};

export function genPacakgeStyle(options: Options) {
  const styleDepsJson = require(STYPE_DEPS_JSON_FILE);
  const ext = '.' + CSS_LANG;

  let content = '';

  let baseFile = getCssBaseFile();
  if (baseFile) {
    if (options.pathResolver) {
      baseFile = options.pathResolver(baseFile);
    }

    content += `@import "${baseFile}";\n`;
  }

  content += styleDepsJson.sequence
    .map((name: string) => {
      let path = join(SRC_DIR, `${name}/index${ext}`);

      if (options.pathResolver) {
        path = options.pathResolver(path);
      }

      return `@import "${path}";`;
    })
    .join('\n');

  smartOutputFile(options.outputPath, content);
}
