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
  // The client.ts file needs to be required, but Node.js can't directly require .ts files
  // Instead, we need to re-export from the parent directory's client
  // Since files are copied to default/, we can require them directly
  const indexPath = path.join(defaultPath, 'index.js')
  
  // Check if client.js exists (compiled) or if we need to use client.ts
  const clientJsPath = path.join(defaultPath, 'client.js')
  const clientTsPath = path.join(defaultPath, 'client.ts')
  
  let indexContent
  if (fs.existsSync(clientJsPath)) {
    // Use compiled JS file
    indexContent = "module.exports = require('./client');\n"
  } else if (fs.existsSync(clientTsPath)) {
    // Try to require the TS file (may work in some environments)
    // Otherwise, try to require from parent
    indexContent = `// Prisma Client default export
try {
  // Try requiring the copied client.ts file
  module.exports = require('./client');
} catch (e) {
  // Fallback: require from parent directory
  try {
    module.exports = require('../client');
  } catch (e2) {
    // Last fallback: use path resolution
    const path = require('path');
    const clientPath = path.join(__dirname, '..', 'client');
    module.exports = require(clientPath);
  }
}
`
  } else {
    // No client file found, try parent
    indexContent = "module.exports = require('../client');\n"
  }
  
  fs.writeFileSync(indexPath, indexContent)
  console.log('Created/updated index.js in default directory')
  
  console.log(`✅ Prisma client setup complete (copied ${copiedCount} items to default/)`)
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
