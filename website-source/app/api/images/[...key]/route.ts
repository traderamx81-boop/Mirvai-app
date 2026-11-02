import {env} from "cloudflare:workers";
export async function GET(_r:Request,{params}:{params:Promise<{key:string[]}>}){const {key}=await params;const o=await env.BUCKET.get(key.join("/"));if(!o)return new Response("Not found",{status:404});return new Response(o.body,{headers:{"content-type":o.httpMetadata?.contentType||"image/jpeg","cache-control":"public, max-age=86400"}})}
