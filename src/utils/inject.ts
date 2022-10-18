import fs from 'fs-extra';
import _ from 'lodash';

export const injectFile = (direction: string, filename: string) => {
  const files = fs.readdirSync(direction);

  const index = _.findIndex(
    files,
    (e) => {
      return e.includes(filename);
    },
    0
  );

  return files[index];
};
