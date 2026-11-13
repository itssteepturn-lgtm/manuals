/* 只缓存页面本身（让没网时也能打开）。手册数据另外存在本机数据库里。 */
var V='manuals-shell-v1';
self.addEventListener('install',function(e){ e.waitUntil(caches.open(V).then(function(c){ return c.addAll(['./','./index.html']); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch',function(e){
  var r=e.request, u=new URL(r.url);
  if(r.method!=='GET' || u.origin!==location.origin) return;
  if(!(u.pathname.endsWith('/') || u.pathname.endsWith('.html'))) return;
  e.respondWith(caches.open(V).then(function(c){
    return c.match(r,{ignoreSearch:true}).then(function(hit){
      var net=fetch(r).then(function(resp){ if(resp&&resp.ok) c.put(r,resp.clone()); return resp; }).catch(function(){ return hit; });
      return hit||net;
    });
  }));
});
