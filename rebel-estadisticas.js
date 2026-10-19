(() => {
"use strict";
const RECEPTOR="https://rebelradio-estadisticas.duckdns.org";
const CLAVE_CLIENTE="rebel_cliente_id";
const MESES_ID=13;
let idSesion=null;
function crearId(){return(window.crypto&&crypto.randomUUID)?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).substring(2);}
function nuevoRegistro(){const creado=new Date(),expira=new Date(creado);expira.setMonth(expira.getMonth()+MESES_ID);return{id:crearId(),creado:creado.toISOString(),expira:expira.toISOString()};}
function obtenerClienteId(){try{const raw=localStorage.getItem(CLAVE_CLIENTE);if(raw){try{const r=JSON.parse(raw);if(r&&typeof r.id==="string"&&r.expira&&Date.parse(r.expira)>Date.now())return r.id;}catch(_){}}const r=nuevoRegistro();localStorage.setItem(CLAVE_CLIENTE,JSON.stringify(r));return r.id;}catch(_){if(!idSesion)idSesion=crearId();return idSesion;}}
function procedenciaLimitada(){if(!document.referrer)return null;try{const u=new URL(document.referrer);return u.origin+u.pathname;}catch(_){return null;}}
function enviar(tipo,extra={}){fetch(RECEPTOR+"/evento",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"omit",referrerPolicy:"no-referrer",keepalive:true,body:JSON.stringify({cliente_id:obtenerClienteId(),tipo,pagina:location.pathname+location.search,...extra})}).catch(()=>{});}
enviar("pagina_vista",{procedencia:procedenciaLimitada()});
if(["/programa","/programa.html"].includes(location.pathname.replace(/\/$/,""))){const p=new URLSearchParams(location.search).get("id");if(p)enviar("visita_programa",{programa_id:p});}
document.addEventListener("click",event=>{const cartel=event.target.closest(".cartel");if(cartel&&["/eventos","/eventos.html"].includes(location.pathname.replace(/\/$/,"")))enviar("abre_cartel",{episodio_id:cartel.dataset.eventoImagen||null,programa_id:null});const enlace=event.target.closest("a");if(enlace){const href=enlace.href||"";if(href.includes("mixcloud.com/live/Rock_and_Roll_Rebel_Radio")){enviar("clic_directo");return;}if(href.includes("programa.html?id=")){try{const u=new URL(href),p=u.searchParams.get("id");if(p)enviar(["/programacion","/programacion.html"].includes(location.pathname.replace(/\/$/,""))?"clic_programa_parrilla":"clic_programa",{programa_id:p});}catch(_){}}}const episodio=event.target.closest(".episodio, .tarjeta");if(episodio&&!event.target.closest(".ver-programa")){const p=new URLSearchParams(location.search).get("id");enviar("clic_reproducir",{programa_id:episodio.dataset.programaId||p||null,episodio_id:episodio.dataset.episodioId||null,episodio_fecha:episodio.dataset.episodioFecha||null,episodio_titulo:episodio.dataset.episodioTitulo||null,plataforma:episodio.dataset.proveedor||null});}});
})();
