const SIDEBAR_ID = 'mt-sidebar-host';
const SIDEBAR_WIDTH = '500px';

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
    backgroundColor: '#0b0f14',
    boxShadow: '4px 0 25px rgba(0, 0, 0, 0.5)',
  });
  document.body.appendChild(host);

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'width:100%; height:100%; border:none; margin:0; padding:0; background:#0b0f14;';
  host.appendChild(iframe);

  const handle = document.createElement('div');
  Object.assign(handle.style, {
    position: 'absolute',
    top: '50%',
    right: '-24px',
    transform: 'translateY(-50%)',
    width: '24px',
    height: '60px',
    backgroundColor: '#0b0f14',
    color: '#94a3b8',
    cursor: 'pointer',
    borderRadius: '0 8px 8px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    border: '1px solid #1e293b',
    borderLeft: 'none',
    boxShadow: '4px 0 10px rgba(0, 0, 0, 0.3)',
    zIndex: '1000000',
  });
  handle.textContent = '⮜';
  handle.title = 'Close MarkTube Sidebar';
  handle.onclick = removeSidebar;
  host.appendChild(handle);

  const scriptURL = chrome.runtime.getURL('assets/sidebar.js');
  const cssURL = chrome.runtime.getURL('assets/sidebar.css');

  const doc = iframe.contentDocument;
  doc.open();
  doc.write(`
    <html lang="en">
      <head>
        <link rel="stylesheet" href="${cssURL}" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100vh;
            background: #0b0f14 !important;
            color: #f8fafc !important;
            font-family: system-ui, -apple-system, sans-serif;
            overflow-y: auto;
          }
          #mt-sidebar-root {
            width: 100%;
            min-height: 100vh;
            background: #0b0f14 !important;
          }
        </style>
      </head>
      <body>
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
