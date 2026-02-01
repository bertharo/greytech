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
  // Instead of requiring client.ts (which Node.js can't handle), we'll re-export from @prisma/client
  // This avoids the TypeScript file resolution issue
  const indexPath = path.join(defaultPath, 'index.js')
  
  // Create a proper module that re-exports from @prisma/client
  // This works because @prisma/client should be able to find the generated client
  const indexContent = `// Prisma Client default export for @prisma/client compatibility
// Re-export from @prisma/client which handles the client resolution internally
try {
  // Try to require from @prisma/client directly
  const prismaClient = require('@prisma/client');
  module.exports = prismaClient;
} catch (e) {
  // Fallback: try to require the client file directly using path resolution
  const path = require('path');
  const fs = require('fs');
  
  // Try multiple possible locations
  const possiblePaths = [
    path.join(__dirname, '..', 'client'),
    path.join(__dirname, 'client'),
    path.resolve(__dirname, '..', 'client.ts'),
    path.resolve(__dirname, 'client.ts')
  ];
  
  let loaded = false;
  for (const clientPath of possiblePaths) {
    try {
      if (fs.existsSync(clientPath) || fs.existsSync(clientPath + '.ts') || fs.existsSync(clientPath + '.js')) {
        try {
          module.exports = require(clientPath);
          loaded = true;
          break;
        } catch (e2) {
          // Try with .ts extension
          try {
            module.exports = require(clientPath + '.ts');
            loaded = true;
            break;
          } catch (e3) {
            // Try with .js extension
            try {
              module.exports = require(clientPath + '.js');
              loaded = true;
              break;
            } catch (e4) {
              // Continue to next path
            }
          }
        }
      }
    } catch (e5) {
      // Continue to next path
    }
  }
  
  if (!loaded) {
    throw new Error(\`Failed to load Prisma Client from any path. Original error: \${e.message}\`);
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
