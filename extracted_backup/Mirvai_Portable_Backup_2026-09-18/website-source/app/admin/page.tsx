import {requireChatGPTUser,chatGPTSignOutPath} from "../chatgpt-auth";import AdminClient from "./admin-client";
export const dynamic="force-dynamic";
export default async function Admin(){const u=await requireChatGPTUser("/admin");if(u.email.toLowerCase()!=="stevenraechelle@gmail.com")return <main className="admin-denied"><h1>Access restricted</h1><p>This CRM is only available to the Mirvai administrator.</p></main>;return <><header className="admin-top"><b>MIRVAI CRM</b><span>{u.displayName} · <a href={chatGPTSignOutPath("/")}>Sign out</a></span></header><AdminClient/></>}
