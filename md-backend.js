(function(){
  const G=window.MD_GATEWAY_URL||''; const TOKEN_KEY='md_customer_device_token';
  let account=(()=>{try{return JSON.parse(localStorage.getItem('md_account')||'{}')}catch(e){return {}}})();
  function token(){let t=localStorage.getItem(TOKEN_KEY);if(!t){t=(crypto&&crypto.randomUUID?crypto.randomUUID():'md-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));localStorage.setItem(TOKEN_KEY,t)}return t}
  async function call(action,payload){if(!G)return {ok:false,offline:true};try{const r=await fetch(G,{method:'POST',headers:{'Content-Type':'application/json','x-md-customer-token':token()},body:JSON.stringify({action,...(payload||{})})});const j=await r.json().catch(()=>({}));if(!r.ok||j.ok===false)return {ok:false,error:j.error||j.message||('Gateway HTTP '+r.status),data:j.data||j};return {ok:true,data:j.data??j}}catch(e){return {ok:false,error:e.message||String(e)}}}
  function ready(){return !!G}
  function session(){return Promise.resolve(account&&(account.id||account.email||account.phone)?{user:account}:null)}
  function syncLocalAccount(){try{account=JSON.parse(localStorage.getItem('md_account')||'{}')}catch(e){account={}}return Promise.resolve(account)}
  async function upsertProfile(data){account={...account,...data};if(!account.createdAt)account.createdAt=new Date().toISOString();localStorage.setItem('md_account',JSON.stringify(account));const r=await call('upsert_profile',{profile:{...data,name:data.name||account.name||null,full_name:data.name||account.name||null}});return r.ok?{ok:true,remote:true}:{...r}}
  async function submitRequest(item,details){const a=account||{},d={...(details||{})};const r=await call('submit_order',{item:item||'Requirement',details:d,request_id:d['Request ID']||null,sync_token:d['Sync Token']||null,customer:{name:a.name||'',full_name:a.name||'',phone:a.phone||'',email:a.email||'',address:a.address||'',location:a.location||'',gender:a.gender||'',age:a.age||''}});return r.ok?{ok:true,remote:true,data:r.data}:{...r}}
  async function myRequests(){const r=await call('my_orders',{});return r.ok?{ok:true,data:Array.isArray(r.data)?r.data:(r.data?.orders||[])}:{...r}}
  async function messages(orderId){const r=await call('messages',{order_id:orderId});return r.ok?{ok:true,data:Array.isArray(r.data)?r.data:(r.data?.messages||[])}:{...r}}
  async function sendMessage(orderId,message){const text=String(message||'').trim();if(!text||text.length>2000)return {ok:false,error:'Message must be 1–2000 characters.'};const r=await call('send_message',{order_id:orderId,message:text});return r.ok?{ok:true,data:r.data}:{...r}}
  async function deleteRequest(id,tokenArg){const r=await call('delete_order',{order_id:id,sync_token:tokenArg||null});return r.ok?{ok:true,remote:true}:{...r}}
  async function getOrderStatus(syncToken){const r=await myRequests();if(!r.ok)return r;const hit=(r.data||[]).find(x=>x.sync_token===syncToken||x.syncToken===syncToken||x.request_id===syncToken||x.id===syncToken);return hit?{ok:true,data:{status:String(hit.status||'').toUpperCase(),availability:hit.availability||hit.tracking_note||''}}:{ok:false,error:'Order not found'}}
  function google(){return Promise.resolve({ok:false,error:'Google login is not used by the Supabase gateway.'})}
  function sendOtp(){return Promise.resolve({ok:false,error:'Phone OTP is not configured in this gateway.'})}
  function verifyOtp(){return Promise.resolve({ok:false,error:'Phone OTP is not configured in this gateway.'})}
  function signOut(){localStorage.removeItem('md_account');account={}}
  window.MDBackend={ready,session,syncLocalAccount,upsertProfile,submitRequest,deleteRequest,getOrderStatus,myRequests,messages,sendMessage,google,sendOtp,verifyOtp,signOut};
})();
