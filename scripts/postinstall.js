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
  
  // Create index.js - use a workaround for TypeScript files
  // In Next.js build, TypeScript in node_modules might be transpiled
  // But for now, we'll create a minimal export that defers loading
  const indexPath = path.join(defaultPath, 'index.js')
  
  // Create a proxy that loads the client on first access
  // This defers the TypeScript require until it's actually needed
  const indexContent = `// Prisma Client default export - deferred loading
// This file is required by @prisma/client/default.js
// We use a proxy to defer loading until actually needed

let _clientModule = null;

function getClientModule() {
  if (!_clientModule) {
    // Try to require the client - in Next.js build, TS files might be handled
    // If that fails, we'll get a clear error
    try {
      _clientModule = require('./client');
    } catch (e) {
      // If direct require fails, try parent
      try {
        _clientModule = require('../client');
      } catch (e2) {
        throw new Error(\`Failed to load Prisma Client: \${e.message}. Fallback: \${e2.message}\`);
      }
    }
  }
  return _clientModule;
}

// Export a proxy that loads on access
module.exports = new Proxy({}, {
  get(target, prop) {
    const module = getClientModule();
    return module[prop];
  },
  ownKeys() {
    const module = getClientModule();
    return Reflect.ownKeys(module);
  },
  getOwnPropertyDescriptor(target, prop) {
    const module = getClientModule();
    return Reflect.getOwnPropertyDescriptor(module, prop);
  }
});
`
  
  fs.writeFileSync(indexPath, indexContent)
  console.log('✅ Prisma client generated and default directory created with deferred loading proxy')
} catch (error) {
  console.error('Error setting up Prisma client:', error)
  process.exit(1)
}
