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
export {
  sendStaticFile,
  getResolvedHostForHttpServer
};
