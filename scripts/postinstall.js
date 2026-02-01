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
  // We need to re-export from the parent client.ts file
  const indexPath = path.join(defaultPath, 'index.js')
  
  // The client.ts file is in the parent directory
  // In serverless, we need to use path resolution that works across environments
  const indexContent = `// Prisma Client default export for @prisma/client compatibility
// This file makes .prisma/client/default importable as a module
const path = require('path');

// Try to require from parent directory
// The actual Prisma client is generated in .prisma/client/client.ts
// In Next.js/serverless, TypeScript files are handled by the build system
try {
  // First try: require from parent (most common case)
  module.exports = require('../client');
} catch (e) {
  // Fallback: try with explicit path resolution
  const clientPath = path.resolve(__dirname, '..', 'client');
  try {
    module.exports = require(clientPath);
  } catch (e2) {
    // Last resort: try without extension (Node.js might resolve it)
    try {
      module.exports = require('../client.ts');
    } catch (e3) {
      throw new Error(\`Failed to load Prisma Client: \${e.message}. Fallbacks also failed.\`);
    }
  }
}
`
  
  fs.writeFileSync(indexPath, indexContent)
  console.log('Created/updated index.js in default directory')
  
  console.log(`✅ Prisma client setup complete (copied ${copiedCount} items to default/)`)
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
