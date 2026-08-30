import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const PUBLISHABLE_KEYS = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}");
const SECRET_KEYS = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
const PUBLIC_KEY = String(PUBLISHABLE_KEYS.default ?? "");
const SECRET_KEY = String(SECRET_KEYS.default ?? "");
const ALLOWED_ORIGINS = new Set(["https://sungfix.github.io", "http://localhost", "http://127.0.0.1", "null"]);
const CATEGORIES = new Set(["geral", "conteudo", "playground", "bug", "visual", "sugestao"]);
function cors(origin: string) { return { "Access-Control-Allow-Origin":origin, "Access-Control-Allow-Headers":"apikey, content-type", "Access-Control-Allow-Methods":"POST, OPTIONS", "Vary":"Origin" }; }
function json(status:number, body:Record<string,unknown>, origin:string, extra:Record<string,string>={}) { return new Response(JSON.stringify(body),{status,headers:{...cors(origin),"Content-Type":"application/json; charset=utf-8",...extra}}); }
async function sha256(input:string) { const data=new TextEncoder().encode(input); const digest=await crypto.subtle.digest("SHA-256",data); return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join(""); }
async function adminRpc(path:string, body:unknown) { return fetch(`${SUPABASE_URL}${path}`,{method:"POST",headers:{apikey:SECRET_KEY,"Content-Type":"application/json"},body:JSON.stringify(body)}); }
async function adminInsert(path:string, body:unknown) { return fetch(`${SUPABASE_URL}${path}`,{method:"POST",headers:{apikey:SECRET_KEY,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(body)}); }
Deno.serve(async(req:Request)=>{
  const origin=req.headers.get("origin")??""; const responseOrigin=ALLOWED_ORIGINS.has(origin)?origin:"https://sungfix.github.io";
  if(req.method==="OPTIONS"){ if(!ALLOWED_ORIGINS.has(origin)) return json(403,{error:"origin_not_allowed"},responseOrigin); return new Response(null,{status:204,headers:cors(origin)}); }
  if(req.method!=="POST") return json(405,{error:"method_not_allowed"},responseOrigin);
  if(!ALLOWED_ORIGINS.has(origin)) return json(403,{error:"origin_not_allowed"},responseOrigin);
  if(!PUBLIC_KEY||!SECRET_KEY||!SUPABASE_URL) return json(503,{error:"service_unavailable"},origin);
  if((req.headers.get("apikey")??"")!==PUBLIC_KEY) return json(401,{error:"invalid_api_key"},origin);
  if(Number(req.headers.get("content-length")||0)>8192) return json(413,{error:"payload_too_large"},origin);
  let payload:Record<string,unknown>; try{payload=await req.json();}catch{return json(400,{error:"invalid_json"},origin);}
  if(String(payload.website??"").trim()) return json(204,{},origin);
  const category=String(payload.category??"geral"), message=String(payload.message??"").trim(), page=String(payload.page??"#home").slice(0,200);
  const raw=payload.rating===null||payload.rating===""||payload.rating===undefined?null:Number(payload.rating); const rating=raw===null?null:raw;
  if(!CATEGORIES.has(category)) return json(400,{error:"invalid_category"},origin);
  if(message.length<5||message.length>2000) return json(400,{error:"invalid_message"},origin);
  if(rating!==null&&(!Number.isInteger(rating)||rating<1||rating>5)) return json(400,{error:"invalid_rating"},origin);
  const forwarded=req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(); const clientIp=req.headers.get("cf-connecting-ip")||forwarded||req.headers.get("x-real-ip")||"unknown"; const userAgent=(req.headers.get("user-agent")??"unknown").slice(0,180); const keyHash=await sha256(`${SECRET_KEY}|${clientIp}|${userAgent}`);
  const rateResponse=await adminRpc("/rest/v1/rpc/ee_feedback_consume_rate_limit",{p_key_hash:keyHash,p_limit:3,p_window_seconds:600});
  if(!rateResponse.ok){console.error("feedback_rate_limit_failed",rateResponse.status,await rateResponse.text().catch(()=>""));return json(503,{error:"service_unavailable"},origin);}
  let allowed=false; try{allowed=(await rateResponse.json())===true;}catch{allowed=false;} if(!allowed) return json(429,{error:"rate_limited"},origin,{"Retry-After":"600"});
  const insertResponse=await adminInsert("/rest/v1/ee_feedback",{category,rating,message,page,app_version:50});
  if(!insertResponse.ok){console.error("feedback_insert_failed",insertResponse.status,await insertResponse.text().catch(()=>""));return json(503,{error:"service_unavailable"},origin);}
  return json(200,{ok:true},origin);
});
