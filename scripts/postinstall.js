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
  
  // Copy all files to default directory first
  const filesToCopy = ['client.ts', 'enums.ts', 'browser.ts', 'models.ts', 'commonInputTypes.ts']
  filesToCopy.forEach(file => {
    const srcPath = path.join(prismaClientPath, file)
    const destPath = path.join(defaultPath, file)
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath)
    }
  })
  
  // Copy directories
  const dirsToCopy = ['internal', 'models']
  dirsToCopy.forEach(dir => {
    const srcDir = path.join(prismaClientPath, dir)
    const destDir = path.join(defaultPath, dir)
    if (fs.existsSync(srcDir)) {
      if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true, force: true })
      }
      fs.cpSync(srcDir, destDir, { recursive: true })
    }
  })
  
  // Create index.js that directly re-exports from parent
  // Since we can't require .ts files, we'll use a simple re-export
  // that Next.js/webpack will handle during build
  const indexPath = path.join(defaultPath, 'index.js')
  
  // Simple re-export - webpack should handle the TypeScript resolution
  // during build time, and at runtime the files will be transpiled
  const indexContent = `// Prisma Client default export
// Re-export from parent directory
// Next.js/webpack will transpile TypeScript files during build
module.exports = require('../client');
`
  
  fs.writeFileSync(indexPath, indexContent)
  console.log('✅ Prisma client generated and default directory created')
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
