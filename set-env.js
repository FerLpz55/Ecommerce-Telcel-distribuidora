const { writeFile } = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(writeFile);

// La ruta al archivo de entorno de producción
const targetPath = './src/environments/environment.production.ts';

// Las variables de entorno que Vercel nos dará.
// En Vercel, estas variables deben estar configuradas.
// Soportamos ambos formatos para evitar errores por mayúsculas/minúsculas.
const supabaseUrl = process.env.SUPABASE_URL || process.env.supabaseUrl || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.supabaseKey || '';
const missingVars = [];
if (!supabaseUrl) missingVars.push('SUPABASE_URL (o supabaseUrl)');
if (!supabaseKey) missingVars.push('SUPABASE_KEY (o supabaseKey)');
const isVercelBuild = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV);

// El contenido que se escribirá en el archivo
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '/api',
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}',
};
`;

console.log('Generando el archivo de entorno para producción...');

async function setEnv() {
  if (missingVars.length > 0) {
    if (isVercelBuild) {
      console.error(`ERROR: Faltan variables de entorno en Vercel: ${missingVars.join(', ')}`);
      console.error('Configúralas en Project Settings > Environment Variables y vuelve a desplegar.');
      process.exit(1);
    }
    console.warn('ADVERTENCIA: Las variables de entorno SUPABASE_URL y/o SUPABASE_KEY no están definidas.');
  }
  if (supabaseKey && !supabaseKey.startsWith('eyJ') && !supabaseKey.startsWith('sb_publishable_')) {
    console.warn('ADVERTENCIA: La clave de Supabase parece inválida. Debe iniciar con "eyJ" o "sb_publishable_".');
  }
  await writeFileAsync(targetPath, envConfigFile).catch(err => console.error(err));
  console.log(`Archivo de entorno generado en: ${targetPath}`);
}

setEnv();
