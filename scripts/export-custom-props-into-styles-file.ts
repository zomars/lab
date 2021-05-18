import { writeFile as fsWriteFile } from 'fs';
import { join } from 'path';

import {
  customCssPropsMap,
  TCssPropValue,
} from '../src/utils/load-custom-props-from-theme-ui';

const path = join(__dirname, '../src/styles/theme-ui-custom-props.css');

/**
 * Generate string content for CSS file with custom properties.
 */
function generateCssContent(propsMap: Map<string, TCssPropValue>): string {
  let res = ':root {\n  ';

  const propsLines = Array.from(
    propsMap.entries(),
  ).map(([key, value]: [string, TCssPropValue]): string => {
    return `--theme-ui-${key}: ${value};`;
  });

  res += propsLines.join('\n  ');
  res += '\n}';

  return res;
}

/**
 * Save content to file.
 */
function writeCssFile(path: string, content: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    fsWriteFile(path, content, (err: Error|null) => {
      if (err) {
        reject(err);
      }

      resolve(true);
    });
  });
}

const content = generateCssContent(customCssPropsMap);

writeCssFile(path, content)
  .catch(
    (error: Error) => console.log(error)
  );
