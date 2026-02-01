// Postinstall script to ensure Prisma client is properly set up
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

try {
  // Generate Prisma client
  console.log('Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Ensure .prisma/client/default exists for @prisma/client compatibility
  // @prisma/client expects the generated client to be in .prisma/client/default
  const prismaClientPath = path.join(process.cwd(), 'node_modules/.prisma/client')
  const defaultPath = path.join(prismaClientPath, 'default')
  
  if (!fs.existsSync(prismaClientPath)) {
    console.error('Error: .prisma/client directory not found after generation')
    process.exit(1)
  }
  
  // Always ensure default directory exists and is populated
  if (!fs.existsSync(defaultPath)) {
    console.log('Creating .prisma/client/default directory...')
    fs.mkdirSync(defaultPath, { recursive: true })
  }
  
  // Copy all files and directories from .prisma/client to .prisma/client/default
  // This ensures @prisma/client can find the generated client
  const files = fs.readdirSync(prismaClientPath)
  let copiedCount = 0
  
  files.forEach(file => {
    if (file !== 'default' && !file.startsWith('.')) {
      const srcPath = path.join(prismaClientPath, file)
      const destPath = path.join(defaultPath, file)
      
      try {
        const stat = fs.statSync(srcPath)
        
        if (stat.isDirectory()) {
          // Use recursive copy for directories
          if (fs.existsSync(destPath)) {
            fs.rmSync(destPath, { recursive: true, force: true })
          }
          fs.cpSync(srcPath, destPath, { recursive: true })
          copiedCount++
        } else {
          // Copy file
          fs.copyFileSync(srcPath, destPath)
          copiedCount++
        }
      } catch (err) {
        console.warn(`Warning: Could not copy ${file}:`, err.message)
      }
    }
  })
  
  // Verify that client.ts exists in default directory
  const clientTsPath = path.join(defaultPath, 'client.ts')
  if (!fs.existsSync(clientTsPath)) {
    console.error('Error: client.ts not found in .prisma/client/default')
    console.error('This may cause "Cannot find module .prisma/client/default" errors')
    process.exit(1)
  }
  
  // Create index.js in default directory to make it importable as a module
  // @prisma/client/default.js requires '.prisma/client/default' which should export the client
  // Since we copy client.ts to default/, we should require from the same directory
  const indexPath = path.join(defaultPath, 'index.js')
  const clientTsInDefault = path.join(defaultPath, 'client.ts')
  const clientInParent = path.join(prismaClientPath, 'client.ts')
  
  // Check if client.ts exists in default directory (we copy it there)
  // If not, require from parent
  let indexContent
  if (fs.existsSync(clientTsInDefault)) {
    // Client file is in default directory, require from same directory
    // Note: TypeScript files need to be handled by the build system
    // In Next.js, they're transpiled, so we can require them
    indexContent = `// Prisma Client default export
// Client file is in the same directory (copied during postinstall)
try {
  module.exports = require('./client');
} catch (e) {
  // Fallback to parent if same directory doesn't work
  module.exports = require('../client');
}
`
  } else {
    // Client file not in default, require from parent
    indexContent = `// Prisma Client default export
// Require from parent directory where Prisma generates the client
module.exports = require('../client');
`
  }
  
  fs.writeFileSync(indexPath, indexContent)
  console.log('Created/updated index.js in default directory')
  
  console.log(`✅ Prisma client setup complete (copied ${copiedCount} items to default/)`)
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
