// Postinstall script to ensure Prisma client is generated and accessible
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

try {
  // Generate Prisma client
  console.log('Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // @prisma/client expects .prisma/client/default to exist
  // Create it if it doesn't exist
  const prismaClientPath = path.join(process.cwd(), 'node_modules/.prisma/client')
  const defaultPath = path.join(prismaClientPath, 'default')
  
  if (!fs.existsSync(defaultPath)) {
    fs.mkdirSync(defaultPath, { recursive: true })
  }
  
  // Copy client.ts to default directory so we can require it
  const clientTsPath = path.join(prismaClientPath, 'client.ts')
  const clientTsInDefault = path.join(defaultPath, 'client.ts')
  
  if (fs.existsSync(clientTsPath)) {
    fs.copyFileSync(clientTsPath, clientTsInDefault)
  }
  
  // Create index.js that requires from same directory
  const indexPath = path.join(defaultPath, 'index.js')
  // In Next.js/serverless, TypeScript files are handled, but we'll try both
  const indexContent = `// Re-export Prisma client
// Try to require from same directory first (where we copied client.ts)
try {
  module.exports = require('./client');
} catch (e) {
  // Fallback: try parent directory
  module.exports = require('../client');
}
`
  
  fs.writeFileSync(indexPath, indexContent)
  console.log('✅ Prisma client generated and default directory created')
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
