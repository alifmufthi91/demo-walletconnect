/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("/walletconnect-example-dapp/workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/walletconnect-example-dapp/workbox-v3.6.3"});

importScripts(
  "/walletconnect-example-dapp/precache-manifest.171ab0b48be585e829410920414c176c.js"
);

workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/walletconnect-example-dapp/index.html", {
  
  blacklist: [/^\/_/,/\/[^/]+\.[^/]+$/],
});