const { writeFile } = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(writeFile);

// La ruta al archivo de entorno de producción
const targetPath = './src/environments/environment.production.ts';

// Las variables de entorno que Vercel nos dará.
// En Vercel, estas variables deben estar configuradas.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// El contenido que se escribirá en el archivo
const envConfigFile = `export const environment = {
  production: true,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}',
};
`;

console.log('Generando el archivo de entorno para producción...');

async function setEnv() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('ADVERTENCIA: Las variables de entorno SUPABASE_URL y/o SUPABASE_KEY no están definidas.');
    console.warn('Esto es normal en desarrollo local, pero es un error si ocurre durante el despliegue en Vercel.');
  }
  await writeFileAsync(targetPath, envConfigFile).catch(err => console.error(err));
  console.log(`Archivo de entorno generado en: ${targetPath}`);
}

setEnv();