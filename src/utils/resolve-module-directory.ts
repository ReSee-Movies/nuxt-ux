import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';


/**
 * Returns the absolute path to an NPM package dependency.
 */
export function resolveModuleDirectory(entry: string, ...packagePaths: string[]) {
  const packageName = entry.includes('/')
    ? entry.startsWith('@')
      ? entry.split('/').slice(0, 2).join('/')
      : entry.split('/')[0] as string
    : entry;

  const require     = createRequire(import.meta.url);
  const lookupPaths = require.resolve.paths(entry)?.map((p) => join(p, packageName));

  const directory = lookupPaths?.find((p) => existsSync(p));

  if (directory && packagePaths.length) {
    return join(directory, ...packagePaths);
  }

  return directory;
}
