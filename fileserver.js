import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default configuration
const DEFAULT_PORT = 3000;
const DEFAULT_OUTPUT_DIR = './output/app';

// MIME type mapping
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Get command line arguments
const args = process.argv.slice(2);
const outputDir = args[0] || DEFAULT_OUTPUT_DIR;
const port = parseInt(args[1]) || DEFAULT_PORT;

// Resolve the absolute path to the output directory
const absoluteOutputDir = join(__dirname, outputDir);

console.log(`Starting file server...`);
console.log(`Serving files from: ${absoluteOutputDir}`);
console.log(`Server will be available at: http://localhost:${port}/served/app/`);

const server = createServer(async (req, res) => {
    try {
        // Parse the URL
        const url = new URL(req.url, `http://localhost:${port}`);
        let path = url.pathname;

        // Handle the /served/app/ route
        if (path.startsWith('/served/app/')) {
            // Remove the /served/app/ prefix to get the actual file path
            path = path.replace('/served/app/', '');

            // If no path is specified, serve index.html
            if (!path || path === '') {
                path = 'index.html';
            }

            // Construct the full file path
            const filePath = join(absoluteOutputDir, path);

            // Read the file
            let fileContent = await readFile(filePath);

            // If it's an HTML file, rewrite asset paths
            if (extname(path).toLowerCase() === '.html') {
                fileContent = fileContent.toString()
                    .replace(/src="\/assets\//g, 'src="/served/app/assets/')
                    .replace(/href="\/assets\//g, 'href="/served/app/assets/');
            }

            // Determine MIME type
            const ext = extname(path).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            // Set headers
            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': Buffer.byteLength(fileContent),
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            });

            // Send the file content
            res.end(fileContent);

        } else if (path.startsWith('/assets/')) {
            // Handle direct asset requests (fallback for any missed rewrites)
            path = path.replace('/assets/', '');
            const filePath = join(absoluteOutputDir, 'assets', path);

            const fileContent = await readFile(filePath);
            const ext = extname(path).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': fileContent.length,
                'Cache-Control': 'public, max-age=3600'
            });

            res.end(fileContent);

        } else if (path === '/served/app' || path === '/served/app/') {
            // Redirect /served/app to /served/app/
            res.writeHead(301, {
                'Location': '/served/app/'
            });
            res.end();

        } else {
            // Handle 404 for other routes
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Not Found\nUse /served/app/ to access the application');
        }

    } catch (error) {
        if (error.code === 'ENOENT') {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - File Not Found');
        } else {
            // Server error
            console.error('Server error:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        }
    }
});

server.listen(port, () => {
    console.log(`File server is running on port ${port}`);
    console.log(`Access your app at: http://localhost:${port}/served/app/`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
}); 