// @bun
// src/http-utils.ts
function hasExt(filepath) {
  if (typeof filepath === 'undefined') return false;

  const f = filepath.split("?")[0].split("#")[0].split('/').pop();

  if (f.indexOf('.') === -1) return false;

  return true;
}

async function sendStaticFile(pathname, localPath, options) {
  const file = Bun.file(localPath);
  const exists = await file.exists();

  if (!exists) {
    return new Response("404: Not Found", { status: 404 });
  }

  const assetsPrefix = `/${options.assets}/`;
  function isImmutableAsset(pathname2) {
    return pathname2.startsWith(assetsPrefix);
  }
  if (isImmutableAsset(pathname)) {
    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  }
  return new Response(file);
}
function getResolvedHostForHttpServer(host) {
  if (host === false) {
    return "127.0.0.1";
  } else if (host === true) {
    return;
  } else {
    return host;
  }
}

// src/server.ts
import { App } from "astro/app";
function start(manifest, options) {
  const app2 = new App(manifest);
  const logger = app2.getAdapterLogger();
  const handle = handler(manifest, options);
  _server = Bun.serve({
    port: options.port,
    hostname: getResolvedHostForHttpServer(options.host),
    fetch: handle,
    error(error) {
      return new Response(`<pre>${error}\n${error.stack}</pre>`, {
        headers: {
          "Content-Type": "text/html"
        }
      });
    }
  });
  logger.info(`Bun server listening on port ${_server.port}`);
}
function createExports(manifest, options) {
  const handle = handler(manifest, options);
  return {
    stop() {
      if (_server) {
        _server.stop();
        _server = undefined;
      }
    },
    running() {
      return _server !== undefined;
    },
    async start() {
      return start(manifest, options);
    },
    handle
  };
}

// var handler = function (manifest, options) {
//   const clientRoot = options.client ?? new URL("../client/", import.meta.url).href;
//   const app2 = new App(manifest);
//   return async (req) => {
//     if (app2.match(req)) {
//       return await app2.render(req);
//     }
//     const url = new URL(req.url);
//     if (manifest.assets.has(url.pathname)) {
//       const localPath = new URL(app2.removeBase(url.pathname), clientRoot);
//       return sendStaticFile(url.pathname, localPath, options);
//     }
//     return await app2.render(req);
//   };
// };

var handler = function (manifest, options) {
  const clientRoot = options.client ?? new URL("../client/", import.meta.url).href;
  const app2 = new App(manifest);
  return async (req) => {

    if (app2.match(req)) {
      return await app2.render(req);
    }
    const url = new URL(req.url);

    if (manifest.assets.has(url.pathname)) {
      const localPath = new URL(app2.removeBase(url.pathname), clientRoot);
      return sendStaticFile(url.pathname, localPath, options);
    }

    let response = '';
    if (url.pathname === '/') {
      const localPath = new URL(app2.removeBase('/index.html'), clientRoot);
      return sendStaticFile(url.pathname, localPath, options);
    }

    if (!hasExt(url.pathname)) {
      const localPath = new URL(app2.removeBase(url.pathname + '/index.html'), clientRoot);
      response = await sendStaticFile(url.pathname, localPath, options);
    } else {
      const localPath = new URL(app2.removeBase(url.pathname), clientRoot);
      response = await sendStaticFile(url.pathname, localPath, options);
    }

    if (response.status == 404) {
      return await app2.render(req);
    } else {
      return response;
    }
  };
};

var _server = undefined;
export {
  start,
  createExports
};
