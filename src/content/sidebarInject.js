const SIDEBAR_ID = 'mt-sidebar-host';
const SIDEBAR_WIDTH = '400px';

export function injectSidebar() {
  if (document.getElementById(SIDEBAR_ID)) return;

  const host = document.createElement('div');
  host.id = SIDEBAR_ID;
  Object.assign(host.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: SIDEBAR_WIDTH,
    height: '100vh',
    zIndex: '999999',
    border: 'none',
    margin: '0',
    padding: '0',
    backgroundColor: 'transparent',
  });
  document.body.appendChild(host);

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'width:100%; height:100%; border:none; margin:0; padding:0; background:transparent;';
  host.appendChild(iframe);

  const handle = document.createElement('div');
  Object.assign(handle.style, {
    position: 'absolute',
    top: '50%',
    right: '-15px',
    transform: 'translateY(-50%)',
    width: '15px',
    height: '54px',
    backgroundColor: '#0f172a',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '0 8px 8px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    zIndex: '1000000',
  });
  handle.textContent = '⮜';
  handle.title = 'Close MarkTube Sidebar';
  handle.onclick = removeSidebar;
  host.appendChild(handle);

  // IMPORTANT: these two filenames must exactly match what
  // vite.config.sidebar.js outputs (entryFileNames/assetFileNames)
  // and what manifest.json lists under web_accessible_resources.
  // If you rename one, rename all three together — never just this file.
  const scriptURL = chrome.runtime.getURL('assets/sidebar.js');
  const cssURL = chrome.runtime.getURL('assets/sidebar.css');

  const doc = iframe.contentDocument;
  doc.open();
  doc.write(`
    <html lang="en">
      <head>
        <link rel="stylesheet" href="${cssURL}" />
      </head>
      <body style="margin:0;padding:0;">
        <div id="mt-sidebar-root"></div>
        <script src="${scriptURL}"></script>
      </body>
    </html>
  `);
  doc.close();

  const style = document.createElement('style');
  style.id = 'mt-sidebar-page-shift';
  style.textContent = `html { margin-left: ${SIDEBAR_WIDTH} !important; transition: margin-left 0.3s ease; }`;
  document.head.appendChild(style);
}

export function removeSidebar() {
  document.getElementById(SIDEBAR_ID)?.remove();
  document.getElementById('mt-sidebar-page-shift')?.remove();
}

export function toggleSidebar() {
  document.getElementById(SIDEBAR_ID) ? removeSidebar() : injectSidebar();
}
