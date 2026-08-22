const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Read the list_screens output and list_design_systems output
const screensOutput = JSON.parse(fs.readFileSync('C:/Users/parth/.gemini/antigravity-ide/brain/d3b3b8a5-4e8f-4053-944f-44ab7cbc8ffe/.system_generated/steps/11/output.txt', 'utf8'));
const designSysOutput = JSON.parse(fs.readFileSync('C:/Users/parth/.gemini/antigravity-ide/brain/d3b3b8a5-4e8f-4053-944f-44ab7cbc8ffe/.system_generated/steps/17/output.txt', 'utf8'));

const targetDir = path.join(__dirname, 'stitch');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const get = (targetUrl) => {
      const client = targetUrl.startsWith('https') ? https : http;
      client.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          return reject(new Error(`Failed to get '${targetUrl}' (${res.statusCode})`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        reject(err);
      });
    };
    get(url);
  });
}

const requestedScreens = [
  { order: '01', id: 'asset-stub-assets_bf0ac12045974068b6fe432f38bb6092', title: 'Design System', isDesignSystem: true },
  { order: '02', id: 'b8d75dc7d4ff4a4d8fc893a470bc52f1', title: 'Your Feed' },
  { order: '03', id: '1dc3e445e39c4de29d61a6691b5918c8', title: 'Stamina Stats' },
  { order: '04', id: '6eb3755142a1480392418ca8512e01ad', title: 'Article View' },
  { order: '05', id: '8e2ff3be6f464ac9b6ec824129c41af6', title: 'Library' },
  { order: '06', id: '7f18c713266f478292f9251dc859cfd3', title: 'Onboarding: Interests' },
  { order: '07', id: '183502fb3d7a46778203d08ffbca2c1c', title: 'Feed: Short Card' },
  { order: '08', id: '4594e1ac8b4b4cf1ae6c9a56610682dd', title: 'Feed: Medium Card' },
  { order: '09', id: 'fae874d093b14e8e9f3d666f9ad415a0', title: 'Feed: Long Card' },
  { order: '10', id: '9a6566c14f984c359229425decd37574', title: 'Quick Check Overlay' },
  { order: '11', id: 'f5e29bef793a48b99df1fd1960b51453', title: 'Refresher Card' },
  { order: '12', id: '6c4431c4f7404a8b965d3fd052a414a4', title: 'Learning Path' },
  { order: '13', id: '8abeccb211454bcaa4a9873f0765a562', title: 'Stamina Progress' },
  { order: '14', id: '6c538f2b514744dfa071aec2370a5bcc', title: 'Onboarding: Stamina Picker' }
];

async function main() {
  const screensMap = new Map();
  for (const s of screensOutput.screens) {
    const screenId = s.name.split('/').pop();
    screensMap.set(screenId, s);
  }

  const summary = [];

  for (const item of requestedScreens) {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const folderName = `${item.order}_${slug}`;
    const screenDir = path.join(targetDir, folderName);
    if (!fs.existsSync(screenDir)) {
      fs.mkdirSync(screenDir, { recursive: true });
    }

    if (item.isDesignSystem) {
      console.log(`Processing ${item.order}: ${item.title}...`);
      const ds = designSysOutput.designSystems[0];
      const mdContent = ds.designSystem.designMd || ds.designSystem.styleGuidelines;
      fs.writeFileSync(path.join(screenDir, 'design-system.md'), mdContent, 'utf8');
      fs.writeFileSync(path.join(screenDir, 'design-system.json'), JSON.stringify(ds, null, 2), 'utf8');
      summary.push({ title: item.title, id: item.id, dir: folderName, files: ['design-system.md', 'design-system.json'] });
      continue;
    }

    const screen = screensMap.get(item.id);
    if (!screen) {
      console.error(`Screen not found for ID: ${item.id}`);
      continue;
    }

    console.log(`Downloading ${item.order}: ${item.title} (${item.id})...`);
    const files = [];

    if (screen.htmlCode && screen.htmlCode.downloadUrl) {
      const htmlPath = path.join(screenDir, 'code.html');
      await downloadFile(screen.htmlCode.downloadUrl, htmlPath);
      files.push('code.html');
    }

    if (screen.screenshot && screen.screenshot.downloadUrl) {
      const imgPath = path.join(screenDir, 'screenshot.png');
      await downloadFile(screen.screenshot.downloadUrl, imgPath);
      files.push('screenshot.png');
    }

    summary.push({ title: item.title, id: item.id, dir: folderName, files });
  }

  fs.writeFileSync(path.join(targetDir, 'README.md'), `# Stitch Project Screens Export\n\nProject: Tidbit Attention Trainer (ID: 6532286677095069897)\n\n` +
    summary.map(s => `### ${s.title}\n- Directory: \`${s.dir}/\`\n- ID: \`${s.id}\`\n- Files: ${s.files.map(f => `\`${f}\``).join(', ')}\n`).join('\n'), 'utf8');

  console.log('All downloads completed successfully!');
}

main().catch(err => {
  console.error('Error during download:', err);
  process.exit(1);
});
