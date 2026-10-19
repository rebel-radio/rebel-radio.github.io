(() => {
"use strict";

function isHomePage(){
  const path=(location.pathname || "/").replace(/\/+/g,"/");
  return path==="/" || path.endsWith("/index.html");
}

function ensureHomeReturn(){
  const header=document.querySelector("header.rr-header");
  if(!header || isHomePage()) return;

  let link=header.querySelector(".rr-home-return");
  if(link) return;

  link=document.createElement("a");
  link.className="rr-home-return";
  link.href="/";
  link.setAttribute("aria-label","Volver al inicio");
  link.innerHTML='<span class="rr-home-return-icon" aria-hidden="true">↶</span><span>INICIO</span>';

  const langBox=header.querySelector(".rr-lang-box");
  if(langBox){
    header.insertBefore(link,langBox);
  }else{
    header.appendChild(link);
  }
  header.classList.add("rr-has-home-return");
}

function closeMenus(){
  const nav=document.querySelector("header.rr-header nav.rr-main-nav");
  const button=document.querySelector("header.rr-header .rr-menu-toggle");
  if(nav) nav.classList.remove("rr-open");
  if(button) button.setAttribute("aria-expanded","false");
}

function init(){
  try{ localStorage.removeItem("rebelradio_lang"); }catch(_){}

  ensureHomeReturn();

  const nav=document.querySelector("header.rr-header nav.rr-main-nav");
  const button=document.querySelector("header.rr-header .rr-menu-toggle");

  if(button && nav){
    button.textContent="☰ MENÚ";
    button.setAttribute("aria-expanded","false");

    button.addEventListener("click",e=>{
      e.stopPropagation();
      const abrir=!nav.classList.contains("rr-open");
      closeMenus();
      if(abrir){
        nav.classList.add("rr-open");
        button.setAttribute("aria-expanded","true");
      }
    });

    nav.addEventListener("click",e=>{
      if(e.target.closest("a")) closeMenus();
    });
  }

  document.addEventListener("click",closeMenus);
  window.addEventListener("resize",()=>{ if(innerWidth>700) closeMenus(); });
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init,{once:true});
}else{
  init();
}
})();