//base by DGXeon
//re-upload? recode? copy code? give credit ya :)
//YouTube: @DGXeon
//Instagram: unicorn_xeon13
//Telegram: t.me/xeonbotinc
//GitHub: @DGXeon
//WhatsApp: +919339619072
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@DGXeon

const http = require('http');
const fs = require('fs');
const {
   spawn
} = require('child_process');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = path.resolve(__dirname, 'public');
const mimeTypes = {
   '.html': 'text/html',
   '.css': 'text/css',
   '.js': 'application/javascript',
   '.svg': 'image/svg+xml',
   '.png': 'image/png',
   '.jpg': 'image/jpeg',
   '.jpeg': 'image/jpeg',
   '.gif': 'image/gif',
   '.json': 'application/json',
   '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
   const requestUrl = req.url === '/' ? '/index.html' : req.url;
   if (requestUrl === '/status') {
      const status = {
         uptime: process.uptime().toFixed(0),
         port,
         pid: process.pid,
         startedAt: new Date().toISOString()
      };
      res.writeHead(200, {
         'Content-Type': 'application/json'
      });
      return res.end(JSON.stringify(status, null, 2));
   }
   const filePath = path.resolve(publicDir, '.' + requestUrl);
   if (!filePath.startsWith(publicDir + path.sep) && filePath !== publicDir) {
      res.writeHead(404, {
         'Content-Type': 'text/plain'
      });
      return res.end('404 Not Found');
   }
   fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
         res.writeHead(404, {
            'Content-Type': 'text/plain'
         });
         return res.end('404 Not Found');
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, {
         'Content-Type': contentType
      });
      fs.createReadStream(filePath).pipe(res);
   });
});

server.listen(port, () => {
   console.log(`Web server listening on port ${port}`);
});

function start() {
   let args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2)];
   console.log([process.argv[0], ...args].join('\n'));
   let p = spawn(process.argv[0], args, {
         stdio: ['inherit', 'inherit', 'inherit', 'ipc']
      })
      .on('message', data => {
         if (data == 'reset') {
            console.log('Restarting Bot...');
            p.kill();
            start();
         }
      })
      .on('exit', code => {
         console.error('Exited with code:', code);
         if (code == '.' || code == 1 || code == 0) start();
      });
}
start();
